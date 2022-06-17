import dbPromise from "../db/config.js";

/**
 * Return all blogs
 */
export const allBlogs = async (req, res) => {
  try {
    const msg = req.session.message;
    delete req.session.message;

    const db = await dbPromise;
    const query = "SELECT * FROM Blog;";
    const blogs = await db.all(query);

    blogs.forEach((e) => {
      e.createdAt = timeSince(new Date(e.createdAt));
      e.updatedAt = timeSince(new Date(e.updatedAt));
    });

    res.render("home", {
      blogs: blogs,
      title: "HOME PAGE",
      message: msg,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ data: err });
  }
};

/**
 * Create new blog form
 */
export const createBlogForm = (req, res) => {
  res.render("form", { title: "CREATE NEW BLOG" });
};

/**
 * Create new blog handle form
 */
export const createBlog = async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    if (!title || !author || !description || !category)
      res.render("form", { message: "All fields are required!" });

    const db = await dbPromise;
    const query =
      "INSERT INTO Blog (title, author, category, description) VALUES (?, ?, ?, ?);";
    await db.run(query, title, author, category, description);

    req.session.message = "Recored added successfully.";
    setTimeout(() => {
      res.redirect("/");
    }, 2000);
  } catch (err) {
    console.log(err);
    res.render("form", { message: err.message });
  }
};


/**
 * Get single blog
 */
export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await dbPromise;
    const query = "SELECT * FROM Blog WHERE id = ?";
    const blog = await db.get(query, id);

    blog.createdAt = timeSince(new Date(blog.createdAt));
    blog.updatedAt = timeSince(new Date(blog.updatedAt));

    res.render("blog", { blog: blog });
  } catch (err) {
    res.render("blog", { message: err.message });
  }
}


/**
 * Update blog form
 */
export const updateBlogForm = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await dbPromise;
    const query = "SELECT * FROM Blog WHERE id = ?";

    const blog = await db.get(query, id);

    res.render("form", { isUpdating: true, blog: blog });
  } catch (err) {
    res.render("form", { message: err.message });
  }
};

/**
 * Update blog
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, category, author, description } = req.body;
    const { id } = req.params;

    if (!title || !author || !description || !category)
      res.render("form", { message: "All fields are required!" });

    const db = await dbPromise;
    const query =
      "UPDATE Blog SET title = ?, author = ?, category = ?, description = ? , updatedAt = ? WHERE id = ?";
    await db.get(query, title, author, category, description, Date.now(), id);

    req.session.message = "Recored updated successfully.";

    setTimeout(() => {
      res.redirect("/");
    }, 2000);
  } catch (err) {
    res.render("form", { message: err.message });
  }
};

/**
 * Delete blog
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await dbPromise;
    const query = "DELETE FROM Blog WHERE id = ?";

    await db.run(query, id);
    req.session.message = "Recored deleted successfully.";
    res.redirect("/");
  } catch (err) {
    res.render("home", { message: err.message });
  }
};

const intervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

function timeSince(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
}

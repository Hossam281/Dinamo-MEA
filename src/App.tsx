import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Badge,
  Modal,
  Pagination,
} from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  userId?: number;
  id: number;
  title: string;
  body: string;
}

const fetchData = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

function App() {
  const [data, setData] = useState<Post[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const isFetched = useRef(false);
  const [formdata, setFormData] = useState({ title: "", body: "" });
  const [editData, setEditData] = useState<Post | null>(null);
  const [errors, setErrors] = useState({ title: "", body: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchData();
        setData(posts);
        toast.success("Data fetched successfully");
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (!isFetched.current) {
      isFetched.current = true;
      fetchPosts();
    }
  }, []);

  const validateForm = () => {
    const newErrors = { title: "", body: "" };
    let isValid = true;

    if (!formdata.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formdata.body.trim()) {
      newErrors.body = "Body is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        }
      );
      const jsonData = await response.json();
      setData([jsonData, ...data]);
      setFormData({ title: "", body: "" });
      setOpenAddModal(false);
      toast.success("Post added successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editData || !validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${editData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formdata),
        }
      );
      const updatedPost = await response.json();
      console.log(updatedPost);
      setData(
        data.map((post) => (post.id === editData.id ? updatedPost : post))
      );
      setFormData({ title: "", body: "" });
      setOpenEditModal(false);
      toast.success("Post updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" }); // Clear error on input change
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEditModalHandler = (post: Post) => {
    setEditData(post);
    setFormData({ title: post.title, body: post.body });
    setOpenEditModal(true);
  };

  // Filter posts based on the search term
  const filteredData = data.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredData.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Add Modal */}
      <Modal show={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Modal.Header>Add a New Post</Modal.Header>
        <Modal.Body>
          <form
            id="add-post"
            onSubmit={handleAddPost}
            className="grid grid-cols-1 gap-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="font-bold text-lg">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`rounded-md border-2 ${
                  errors.title ? "border-red-600" : "border-gray-300"
                }`}
                value={formdata.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="body" className="font-bold text-lg">
                Body <span className="text-red-600">*</span>
              </label>
              <textarea
                name="body"
                className={`rounded-md border-2 ${
                  errors.body ? "border-red-600" : "border-gray-300"
                }`}
                value={formdata.body}
                onChange={handleChange}
              ></textarea>
              {errors.body && (
                <p className="text-red-600 text-sm">{errors.body}</p>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" form="add-post" type="submit">
            Post
          </Button>
          <Button
            color="failure"
            onClick={() => {
              setOpenAddModal(false);
              setFormData({ title: "", body: "" });
              setErrors({ title: "", body: "" });
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Modal.Header>Edit Post</Modal.Header>
        <Modal.Body>
          <form
            id="edit-post"
            onSubmit={handleEditPost}
            className="grid grid-cols-1 gap-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="font-bold text-lg">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                className={`rounded-md border-2 ${
                  errors.title ? "border-red-600" : "border-gray-300"
                }`}
                value={formdata.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="body" className="font-bold text-lg">
                Body <span className="text-red-600">*</span>
              </label>
              <textarea
                name="body"
                className={`rounded-md border-2 ${
                  errors.body ? "border-red-600" : "border-gray-300"
                }`}
                value={formdata.body}
                onChange={handleChange}
              ></textarea>
              {errors.body && (
                <p className="text-red-600 text-sm">{errors.body}</p>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="success" form="edit-post" type="submit">
            Save Changes
          </Button>
          <Button
            color="failure"
            onClick={() => {
              setOpenEditModal(false);
              setFormData({ title: "", body: "" });
              setErrors({ title: "", body: "" });
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="bg-white  w-full h-screen overflow-auto">
        <div className="flex justify-between md:justify-around sticky top-0 right-0 w-[100%] bg-white z-30 p-5">
          <Badge size="lg" color="indigo">
            Total Posts: {filteredData.length}
          </Badge>

          <Button
            onClick={() => setOpenAddModal(true)}
            color="success"
            className="w-[200px]"
          >
            Add Post
          </Button>
        </div>
        <div className="p-3">
          <input
            className="md:w-[20%] w-[50%] my-2 focus:border-1 focus:outline-none focus:ring-0 rounded-md border-2 border-gray-300"
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          <div className="overflow-x-auto">
            <Table striped>
              <Table.Head>
                <Table.HeadCell>Id</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Body</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {currentPosts.map((post) => (
                  <Table.Row key={post.id}>
                    <Table.Cell>{post.id}</Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell className="min-w-[300px]">
                      {post.body}
                    </Table.Cell>
                    <Table.Cell className="flex gap-2">
                      <Button
                        size="xs"
                        pill
                        onClick={() => openEditModalHandler(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        pill
                        color="failure"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mb-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;

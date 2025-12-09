import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi"; // file API của bạn
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Lấy danh sách category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories(); // gọi API /api/category
        console.log(res); // kiểm tra dữ liệu
        const data = Array.isArray(res) ? res : res.result ? res.result : [];
        setCategories(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Thêm category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.warning("Tên danh mục không được để trống");
      return;
    }
    try {
      const res = await createCategory({ name: newCategoryName });

      // Lấy đúng object category
      const newCategory = res?.result || res;

      setCategories((prev) => [newCategory, ...prev]);
      setNewCategoryName("");
      toast.success("Thêm danh mục thành công");
    } catch (err) {
      console.error(err);
      toast.error("Thêm danh mục thất bại");
    }
  };

  // Sửa category
  const handleEditCategory = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      toast.warning("Tên danh mục không được để trống");
      return;
    }
    try {
      const res = await updateCategory(editCategoryId, {
        name: editCategoryName,
      });

      // Lấy đúng object category
      const updatedCategory = res?.result || res;

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === editCategoryId ? updatedCategory : cat
        )
      );

      setEditCategoryId(null);
      setEditCategoryName("");
      toast.success("Cập nhật danh mục thành công");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật danh mục thất bại");
    }
  };

  // Xóa category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Xóa danh mục thành công");
    } catch (err) {
      console.error(err);
      toast.error("Xóa danh mục thất bại");
    }
  };

  if (loading)
    return <div className="text-center mt-4">Đang tải danh mục…</div>;
  if (error)
    return <div className="text-center mt-4 text-danger">Lỗi: {error}</div>;

  return (
    <div className="container mt-4">
      <h3>Quản lý danh mục</h3>

      {/* Form thêm danh mục */}
      <div className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Tên danh mục mới"
          className="form-control"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddCategory}>
          Thêm
        </button>
      </div>

      {/* Danh sách category */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category, idx) => (
            <tr key={category.id}>
              <td>{indexOfFirstItem + idx + 1}</td>
              <td>
                {editCategoryId === category.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editCategoryId === category.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleUpdateCategory}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditCategoryId(null)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditCategory(category)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {Array.from(
          { length: Math.ceil(categories.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              className={`btn me-2 ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default CategoryManage;

// src/page/ProductManage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

function ProductManage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState({});

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditingProductData({
      ...product,
      previewImages: product.images ? product.images.map((img) => img.url) : [],
      imgFiles: [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?"))
      return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== id));
      alert("Xoá sản phẩm thành công!");
    } catch (error) {
      alert("Xoá thất bại!");
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProductData({ ...editingProductData, [name]: value });
  };

  const handleSave = async () => {
    if (
      !editingProductData.name ||
      !editingProductData.price ||
      !editingProductData.category
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editingProductData.name);
      formData.append("price", editingProductData.price);
      formData.append("inventory", editingProductData.inventory || 0);
      formData.append("origin", editingProductData.origin || "");
      formData.append("category", editingProductData.category);
      formData.append("description", editingProductData.description || "");

      if (
        editingProductData.imgFiles &&
        editingProductData.imgFiles.length > 0
      ) {
        editingProductData.imgFiles.forEach((file) =>
          formData.append("images", file)
        );
      }

      if (editingProductId) {
        await updateProduct(editingProductId, formData);

        const updatedImages =
          editingProductData.imgFiles.length > 0
            ? editingProductData.previewImages
            : editingProductData.previewImages;

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProductId
              ? {
                  ...p,
                  ...editingProductData,
                  images: updatedImages.map((url) => ({ url })),
                }
              : p
          )
        );
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.id === editingProductId
              ? {
                  ...p,
                  ...editingProductData,
                  images: updatedImages.map((url) => ({ url })),
                }
              : p
          )
        );

        alert("Cập nhật sản phẩm thành công!");
        handleCancel();
      }
    } catch (err) {
      console.error(err);
      alert("Lưu sản phẩm thất bại! Kiểm tra console.");
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setEditingProductData({});
  };

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={handleAddProduct}
        >
          <span className="me-1">➕</span> Thêm sản phẩm
        </button>
      </div>

      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng tồn</th>
            <th>Xuất xứ</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td
                  style={{
                    width: "100px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  <img
                    src={product.images?.[0]?.url || ""}
                    alt={product.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto",
                      borderRadius: "4px",
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.inventory || 0}</td>
                <td>{product.origin || ""}</td>
                <td>
                  {categories.find((cat) => cat.id === product.category)
                    ?.name || ""}
                </td>

                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                    gap: "10px",
                    verticalAlign: "middle",
                  }}
                >
                  <button
                    className="btn btn-warning btn-sm"
                    style={{ minWidth: "70px" }}
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ minWidth: "70px" }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {editingProductId === product.id && (
                <tr>
                  <td colSpan="7">
                    <div className="card p-3 shadow-sm">
                      <h5 className="mb-3">Chỉnh sửa sản phẩm</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Tên sản phẩm</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={editingProductData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Giá</label>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={editingProductData.price}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Số lượng tồn</label>
                          <input
                            type="number"
                            className="form-control"
                            name="inventory"
                            value={editingProductData.inventory || 0}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <label className="form-label">Xuất xứ</label>
                          <input
                            type="text"
                            className="form-control"
                            name="origin"
                            value={editingProductData.origin || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Danh mục</label>
                          <select
                            className="form-select"
                            name="category"
                            value={editingProductData.category || ""}
                            onChange={handleChange}
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Mô tả</label>
                          <textarea
                            className="form-control"
                            name="description"
                            value={editingProductData.description || ""}
                            onChange={handleChange}
                            rows={1}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Ảnh sản phẩm</label>
                        <div className="d-flex flex-wrap gap-3">
                          {editingProductData.previewImages?.map(
                            (imgSrc, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <img
                                  src={imgSrc}
                                  alt={`img-${index}`}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    setEditingProductData((prev) => {
                                      const newPreviewImages =
                                        prev.previewImages.filter(
                                          (_, i) => i !== index
                                        );
                                      const newImgFiles = (
                                        prev.imgFiles || []
                                      ).filter((_, i) => i !== index);
                                      return {
                                        ...prev,
                                        previewImages: newPreviewImages,
                                        imgFiles: newImgFiles,
                                      };
                                    });
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    lineHeight: "18px",
                                    textAlign: "center",
                                    padding: 0,
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )}

                          <label className="btn btn-sm btn-success d-flex align-items-center justify-content-center">
                            Thêm ảnh
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              hidden
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const newPreviews = files.map((file) =>
                                  URL.createObjectURL(file)
                                );
                                setEditingProductData((prev) => ({
                                  ...prev,
                                  imgFiles: [
                                    ...(prev.imgFiles || []),
                                    ...files,
                                  ],
                                  previewImages: [
                                    ...(prev.previewImages || []),
                                    ...newPreviews,
                                  ],
                                }));
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mt-3 gap-2">
                        <button
                          className="btn btn-warning"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-center mt-3 gap-1">
        {Array.from(
          { length: Math.ceil(filteredProducts.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ProductManage;

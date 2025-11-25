// src/page/ProductManage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function ProductManage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // danh sách đã filter
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State quản lý sản phẩm đang edit
    const [editingProductId, setEditingProductId] = useState(null);
    const [editingProductData, setEditingProductData] = useState({});

    const [searchText, setSearchText] = useState(""); // state cho tìm kiếm

    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, []);

    // Filter sản phẩm khi searchText thay đổi
    useEffect(() => {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setEditingProductData({ ...product }); // tạo copy để sửa
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProductData({ ...editingProductData, [name]: value });
    };

    const handleSave = () => {
        setProducts((prev) =>
            prev.map((p) =>
                p.id === editingProductId ? editingProductData : p
            )
        );
        setEditingProductId(null);
        setEditingProductData({});
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
                {/* Thanh tìm kiếm */}
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="form-control me-2"
                    style={{ maxWidth: "300px" }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* Nút thêm sản phẩm */}
                <button className="btn btn-success d-flex align-items-center" onClick={handleAddProduct}>
                    <span className="me-1">➕</span> Thêm sản phẩm
                </button>
            </div>

            <table className="table table-bordered table-hover">
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
                    {filteredProducts.map((product) => (
                        <React.Fragment key={product.id}>
                            <tr>
                                <td>
                                    <img
                                        src={product.img || ""}
                                        alt={product.name}
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.inventory || 0}</td>
                                <td>{product.origin || ""}</td>
                                <td>{product.category || ""}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        Edit
                                    </button>
                                    <button className="btn btn-danger">Delete</button>
                                </td>
                            </tr>

                            {/* Form sửa inline */}
                            {editingProductId === product.id && (
                                <tr>
                                    <td colSpan="7">
                                        <div className="card p-3">
                                            <div className="mb-2">
                                                <label className="form-label">Tên sản phẩm</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={editingProductData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Giá</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="price"
                                                    value={editingProductData.price}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Số lượng tồn</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="inventory"
                                                    value={editingProductData.inventory || 0}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Xuất xứ</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="origin"
                                                    value={editingProductData.orgin || ""}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Danh mục</label>
                                                <select
                                                    className="form-select"
                                                    name="category"
                                                    value={editingProductData.category || ""}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Chọn danh mục --</option>
                                                    <option value="Fruits">Trái cây</option>
                                                    <option value="Vegetables">Rau củ</option>
                                                    <option value="Drinks">Đồ uống</option>
                                                    <option value="Snacks">Đồ ăn vặt</option>
                                                    {/* Thêm các danh mục khác nếu cần */}
                                                </select>
                                            </div>

                                            <div className="mb-2">
                                                <label className="form-label">Ảnh sản phẩm</label>
                                                <div className="d-flex align-items-center">
                                                    {/* Preview ảnh */}
                                                    <img
                                                        src={editingProductData.img || ""}
                                                        alt="preview"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                                                    />
                                                    {/* Nút upload */}
                                                    <label className="btn btn-primary mb-0">
                                                        Upload File
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onload = () => {
                                                                        setEditingProductData({ ...editingProductData, img: reader.result });
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <button className="btn btn-success me-2" onClick={handleSave}>
                                                    Save
                                                </button>
                                                <button className="btn btn-danger" onClick={handleCancel}>
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
        </div>
    );
}

export default ProductManage;

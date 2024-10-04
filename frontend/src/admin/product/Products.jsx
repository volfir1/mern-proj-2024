import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
} from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import Modal from "@mui/material/Modal";
import { styled, css } from "@mui/system";
import CreateProduct from "./CreateProduct";
import { useNavigate } from "react-router-dom";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleOpen = () => {
        // Navigate to the page that displays CreateProduct component
        navigate("/admin/create-product");
    };

    const handleUpdate = () => {
        navigate("/admin/update-product");
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/prod-list"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    setError("Invalid data format.");
                }
            } catch (error) {
                setError("Error fetching products.");
            }
        };

        fetchProducts();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} />
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-semibold text-gray-800">
                                Products
                            </h1>
                            <Button variant="outlined" onClick={toggleSidebar}>
                                {isSidebarOpen
                                    ? "Close Sidebar"
                                    : "Open Sidebar"}
                            </Button>
                        </div>

                        <Paper className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm text-gray-600">
                                    All Products:{" "}
                                    <span className="font-bold">
                                        {products.length}
                                    </span>
                                </div>
                                <Button variant="outlined" size="small">
                                    Table settings
                                </Button>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <Button
                                    onClick={handleOpen}
                                    variant="contained"
                                    color="primary"
                                    className="bg-blue-600"
                                >
                                    + Add new product
                                </Button>
                                <div>
                                    <Button
                                        variant="text"
                                        className="text-gray-600 mr-2"
                                    >
                                        Update all
                                    </Button>
                                    <Button
                                        variant="text"
                                        className="text-gray-600 mr-2"
                                    >
                                        Archive all
                                    </Button>
                                    <Button
                                        variant="text"
                                        className="text-gray-600"
                                    >
                                        Delete all
                                    </Button>
                                </div>
                            </div>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>PRODUCT NAME</TableCell>
                                            <TableCell>CATEGORY</TableCell>
                                            <TableCell>PRICE</TableCell>
                                            <TableCell>IN STOCK</TableCell>
                                            <TableCell>ACTIONS</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((product) => (
                                            <TableRow key={product._id}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                                                        <span>
                                                            {product.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                                        {product.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-green-600 font-semibold">
                                                        ${product.price}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`flex items-center ${
                                                            product.inStock
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                                product.inStock
                                                                    ? "bg-green-600"
                                                                    : "bg-red-600"
                                                            }`}
                                                        ></span>
                                                        {product.inStock
                                                            ? "In Stock"
                                                            : "Out of Stock"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={handleUpdate}
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        className="mr-2 bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        className="bg-red-500 hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {error && (
                                <div className="mt-4 text-center text-red-500">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center">
                                    <span className="mr-2">Rows per page:</span>
                                    <Select value={10} size="small">
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4">
                                        1-10 of {products.length}
                                    </span>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled
                                        >
                                            &lt;
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                        >
                                            1
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            2
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            3
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            ...
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            {Math.ceil(products.length / 10)}
                                        </Button>
                                        <Button variant="outlined" size="small">
                                            &gt;
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Product;

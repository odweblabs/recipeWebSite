import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5050/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCat) return;
        try {
            await axios.post('http://localhost:5050/api/categories', { name: newCat });
            setNewCat('');
            fetchCategories();
        } catch (err) {
            alert('Kategori eklenemedi.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`http://localhost:5050/api/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert('Silinemedi.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF2] p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h2>
                    <Link to="/admin/dashboard" className="text-orange-500 hover:text-orange-600">Dashboard'a Dön</Link>
                </div>

                <form onSubmit={handleAdd} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        placeholder="Yeni Kategori Adı"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
                        <Plus className="h-5 w-5 mr-1" /> Ekle
                    </button>
                </form>

                <ul className="divide-y divide-gray-200">
                    {categories.map((cat) => (
                        <li key={cat.id} className="py-4 flex justify-between items-center">
                            <span className="text-gray-800 font-medium">{cat.name}</span>
                            <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                    {categories.length === 0 && <li className="text-center py-4 text-gray-500">Kategori bulunamadı.</li>}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList;

import { useState, useEffect } from 'react';
import type { Category, CreateCategoryData } from '../types';
import { CategoryCard, CreateCategoryModal, ViewCategoryModal } from '../components';
import { categoriesService } from '../services';
import { ConfirmDeleteModal } from '../../../shared/components/ConfirmDeleteModal';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las categorías');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData: CreateCategoryData) => {
    try {
      await categoriesService.create(categoryData);
      setShowCreateModal(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleEditCategory = async (updatedData: CreateCategoryData) => {
    if (categoryToEdit) {
      try {
        await categoriesService.update(categoryToEdit.id, updatedData);
        setCategoryToEdit(null);
        fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error);
        throw error;
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await categoriesService.delete(categoryToDelete.id);
        setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Categorías</h1>
          <p className="text-gray-400">Gestiona las categorías de cursos</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Agregar Categoría</button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="card p-4">
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
            onView={setSelectedCategory}
            onEdit={setCategoryToEdit}
            onDelete={setCategoryToDelete}
          />
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron categorías</p>
        </div>
      )}

      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCategory}
      />

      <CreateCategoryModal
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        onSave={handleEditCategory}
        categoryToEdit={categoryToEdit}
      />

      <ViewCategoryModal
        category={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría?"
        itemName={categoryToDelete?.name || ''}
        onConfirm={handleDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
};

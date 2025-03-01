import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  getCategoryStats,
  getCategoriesWithStats
} from "@/lib/supabase/categories";
import { NewsletterCategory, CategoryWithStats } from "@/lib/supabase/types";
import { motion, AnimatePresence } from "framer-motion";

const COLOR_OPTIONS = [
  { value: "#EF4444", label: "Red" },
  { value: "#F97316", label: "Orange" },
  { value: "#EAB308", label: "Yellow" },
  { value: "#22C55E", label: "Green" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6B7280", label: "Gray" },
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsletterCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithStats | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    color: "#3B82F6"
  });
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesWithStats = await getCategoriesWithStats();
      setCategories(categoriesWithStats);
      setError(null);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      setNewCategory({
        ...newCategory,
        name: value,
        slug: generateSlug(value)
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!editingCategory) return;
    
    if (name === "name") {
      setEditingCategory({
        ...editingCategory,
        name: value,
        slug: generateSlug(value)
      });
    } else {
      setEditingCategory({
        ...editingCategory,
        [name]: value
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      await createCategory(newCategory);
      toast.success("Category created successfully");
      setShowAddDialog(false);
      setNewCategory({
        name: "",
        slug: "",
        color: "#3B82F6"
      });
      loadCategories();
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory(editingCategory.id, editingCategory);
      toast.success("Category updated successfully");
      setShowEditDialog(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      toast.success("Category deleted successfully");
      setShowDeleteDialog(false);
      setDeletingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories Management</CardTitle>
          <CardDescription>
            Create, edit and delete newsletter categories
          </CardDescription>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Create categories to organize your newsletters</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add your first category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Newsletters</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {categories.map((category, index) => (
                  <motion.tr
                    key={category.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span 
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: category.color }}
                        ></span>
                        <span className="text-xs text-gray-500">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {category.count || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category);
                            setShowEditDialog(true);
                          }}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingCategory(category);
                            setShowDeleteDialog(true);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}

        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your newsletters
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-black">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug (URL-friendly name)
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={newCategory.slug}
                  onChange={handleInputChange}
                  placeholder="auto-generated-slug"
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color: color.value })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color.value 
                          ? "ring-2 ring-primary ring-offset-2" 
                          : "ring-0"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
                <Input
                  id="color"
                  name="color"
                  value={newCategory.color}
                  onChange={handleInputChange}
                  placeholder="#RRGGBB"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="text-foreground">
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category details
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4 py-4 text-black">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Category Name
                  </label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingCategory.name}
                    onChange={handleEditChange}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-slug" className="text-sm font-medium">
                    Slug (URL-friendly name)
                  </label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    value={editingCategory.slug}
                    onChange={handleEditChange}
                    placeholder="auto-generated-slug"
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, color: color.value })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          editingCategory.color === color.value 
                            ? "ring-2 ring-primary ring-offset-2" 
                            : "ring-0"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <Input
                    id="edit-color"
                    name="color"
                    value={editingCategory.color}
                    onChange={handleEditChange}
                    placeholder="#RRGGBB"
                    className="mt-2"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="text-foreground">
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>
                <Check className="h-4 w-4 mr-1" />
                Update Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deletingCategory && (
              <div className="py-4 text-black">
                <div className="flex items-center gap-2 p-4 border rounded-md bg-muted/30">
                  <span 
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: deletingCategory.color }}
                  ></span>
                  <span className="font-medium">{deletingCategory.name}</span>
                  {deletingCategory.count && deletingCategory.count > 0 && (
                    <span className="ml-auto px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {deletingCategory.count} newsletter{deletingCategory.count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {deletingCategory.count && deletingCategory.count > 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    <span className="font-medium">Warning:</span> This will remove the category from {deletingCategory.count} newsletter{deletingCategory.count > 1 ? 's' : ''}.
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="text-foreground">
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteCategory}
                className="gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

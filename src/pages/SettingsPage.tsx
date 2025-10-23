import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Category } from '@shared/types';
import { api } from '@/lib/api-client';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ColorSwatch } from '@/components/ColorSwatch';
import { Loader2, MoreVertical, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
const fetchCategories = async (): Promise<Category[]> => api('/api/categories');
const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => api('/api/categories', { method: 'POST', body: JSON.stringify(categoryData) });
const updateCategory = async (categoryData: Category): Promise<Category> => api(`/api/categories/${categoryData.id}`, { method: 'PUT', body: JSON.stringify(categoryData) });
const deleteCategory = async (id: string): Promise<{ id: string }> => api(`/api/categories/${id}`, { method: 'DELETE' });
export function SettingsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDialogOpen(false);
      setCurrentCategory(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed: ${error.message}`);
    },
  };
  const createMutation = useMutation({ ...mutationOptions, mutationFn: createCategory, onSuccess: () => { toast.success("Category created!"); mutationOptions.onSuccess(); } });
  const updateMutation = useMutation({ ...mutationOptions, mutationFn: updateCategory, onSuccess: () => { toast.success("Category updated!"); mutationOptions.onSuccess(); } });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAlertOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error: Error) => toast.error(`Failed to delete: ${error.message}`),
  });
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCategory || !currentCategory.name) return;
    if (currentCategory.id) {
      updateMutation.mutate(currentCategory);
    } else {
      createMutation.mutate({ name: currentCategory.name, color: currentCategory.color });
    }
  };
  const openNewDialog = () => {
    setCurrentCategory({ id: '', name: '', color: '#FF6384' });
    setIsDialogOpen(true);
  };
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };
  const openDeleteAlert = (category: Category) => {
    setCategoryToDelete(category);
    setIsAlertOpen(true);
  };
  return (
    <div className="min-h-screen bg-warm-gradient">
      <AppHeader />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-4xl font-bold font-display text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your expense categories.</p>
              </div>
              <Button onClick={openNewDialog} className="transition-transform hover:scale-105 active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Your Categories</CardTitle>
                <CardDescription>Add, edit, or delete your spending categories.</CardDescription>
              </CardHeader>
              <CardContent>
                {categoriesQuery.isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
                  </div>
                ) : categoriesQuery.isError ? (
                  <div className="text-destructive">Failed to load categories.</div>
                ) : (
                  <ul className="space-y-3">
                    {categoriesQuery.data?.map((cat) => (
                      <li key={cat.id} className="flex items-center justify-between p-3 rounded-md border bg-card">
                        <div className="flex items-center gap-3">
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="font-medium">{cat.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(cat)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteAlert(cat)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">Changes will be reflected across the application.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{currentCategory?.id ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {currentCategory?.id ? 'Update the details for this category.' : 'Create a new category to track your expenses.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentCategory?.name || ''} onChange={(e) => setCurrentCategory(p => p ? { ...p, name: e.target.value } : null)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">Color</Label>
                <ColorSwatch color={currentCategory?.color || '#cccccc'} setColor={(c) => setCurrentCategory(p => p ? { ...p, color: c } : null)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{categoryToDelete?.name}" category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => categoryToDelete && deleteMutation.mutate(categoryToDelete.id)} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// CategoryContent.jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCategoryManager from "../../hooks/usecategoryManager";
import {
  Button, TextField, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Typography,
  Card, CardContent, CardActions, Divider,
  Dialog, DialogActions, DialogContent, DialogTitle,
  CircularProgress
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import Sidebar from "../../components/sidebar/Sidebar";
import SnackbarMessage from '../../components/alert/Snackbar';

const queryClient = new QueryClient();

const CategoryContent = () => {
  const {
    categories,
    dialogState,
    loading,
    error,
    snackbar,
    handleSnackbarClose,
    setDialogState,
    handleClose,
    handleOpen,
    handleSaveNewCategory,
    handleUpdateCategory,
    handleSaveNewSubcategory,
    handleConfirmDelete,
    deleteCategoryMutation,
    handleSaveEditSubcategory
  } = useCategoryManager();

  const renderDialog = (open, title, value, onChange, onSave) => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );

  const renderCategoryCard = ({ _id, name, subcategories = [] }) => (
    <Card key={_id} className="mb-4">
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Divider className="my-2" />
        <List>
          {subcategories.map(({ _id: subId, name: subName }) => (
            <ListItem key={subId} className="border-b pl-8">
              <ListItemText primary={subName} />
              <ListItemSecondaryAction>
                <IconButton 
                  onClick={() => handleOpen(
                    { _id, name }, 
                    { _id: subId, name: subName }
                  )}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setDialogState(prev => ({
                    ...prev,
                    openDeleteDialog: true,
                    deleteId: subId,
                    deleteType: "subcategory",
                    currentCategory: { _id, name }
                  }))}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => handleOpen({ _id, name })}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => setDialogState(prev => ({
          ...prev,
          openDeleteDialog: true,
          deleteId: _id,
          deleteType: "category"
        }))}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={() => setDialogState(prev => ({
          ...prev,
          openAddSubcategory: true,
          currentCategory: { _id, name }
        }))}>
          <AddIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  if (error) {
    return <Typography color="error">Error loading categories: {error.message}</Typography>;
  }

  return (
    <div className="p-4" style={{ paddingLeft: "100px", paddingTop: "60px" }}>
      <Sidebar />
      <Typography variant="h4" gutterBottom>
        Category Manager
      </Typography>

      <SnackbarMessage
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Card className="mb-4">
        <CardContent>
          <div className="flex mb-4 justify-between items-center">
            <Typography variant="h5">Categories</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setDialogState(prev => ({ ...prev, openAddCategory: true }))}
            >
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {Array.isArray(categories) && categories.map(renderCategoryCard)}
        </List>
      )}

      {/* Edit Category/Subcategory Dialog */}
      {renderDialog(
        dialogState.open,
        dialogState.currentCategory ? 
          (dialogState.currentSubcategory ? "Edit Subcategory" : "Edit Category") 
          : "Edit Subcategory",
        dialogState.editName,
        (value) => setDialogState(prev => ({ ...prev, editName: value })),
        dialogState.currentCategory ? 
          (dialogState.currentSubcategory ? handleSaveEditSubcategory : handleUpdateCategory)
          : handleSaveEditSubcategory
      )}

      {/* Add Category Dialog */}
      {renderDialog(
        dialogState.openAddCategory,
        "Add New Category",
        dialogState.newCategory,
        (value) => setDialogState(prev => ({ ...prev, newCategory: value })),
        handleSaveNewCategory
      )}

      {/* Add Subcategory Dialog */}
      {renderDialog(
        dialogState.openAddSubcategory,
        "Add New Subcategory",
        dialogState.newSubcategory,
        (value) => setDialogState(prev => ({ ...prev, newSubcategory: value })),
        handleSaveNewSubcategory
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogState.openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {dialogState.deleteType}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete}
            color="primary" 
            variant="contained"
            disabled={deleteCategoryMutation.isPending}
          >
            {deleteCategoryMutation.isPending ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const Category = () => (
  <QueryClientProvider client={queryClient}>
    <CategoryContent />
  </QueryClientProvider>
);

export default Category;
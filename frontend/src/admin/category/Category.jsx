import React from "react";
import useCategoryManager from "../../hooks/usecategoryManager";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Sidebar from "../../components/sidebar/Sidebar";

const Category = () => {
  const {
    categories,
    newCategory,
    newSubcategory,
    error,
    success,
    open,
    openAddCategory,
    openAddSubcategory,
    currentCategory,
    currentSubcategory,
    editName,
    openDeleteDialog,
    subCategory,
    setNewCategory,
    setNewSubcategory,
    setEditName,
    handleSaveNewCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleSaveNewSubcategory,
    handleUpdateSubcategory,
    handleDeleteSubcategory,
    handleConfirmDelete,
    handleOpen,
    handleClose,
    handleCloseSnackbar,
    handleAddCategory,
    loadCategories,
    getSubCategoryName,
    setSubCategories,
  } = useCategoryManager();

  return (
    <div className="p-4" style={{ paddingLeft: "100px", paddingTop: "60px" }}>
      <Sidebar />
      <Typography variant="h4" gutterBottom>
        Category Manager
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert elevation={6} variant="filled" severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert elevation={6} variant="filled" severity="success">
          {success}
        </Alert>
      </Snackbar>

      <Card className="mb-4">
        <CardContent>
          <div className="flex mb-4 justify-between items-center">
            <Typography variant="h5">Categories</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
          </div>
        </CardContent>
      </Card>

      <List>
        {categories.map(({ _id, name, subcategories }) => (
          <Card key={_id} className="mb-4">
            <CardContent>
              <Typography variant="h6" color="primary">
                {name}
              </Typography>
              <Divider className="my-2" />
              <List>
                {subcategories &&
                  subcategories.map(({ _id: subId, name: subName }) => (
                    <ListItem key={subId} className="border-b pl-8">
                      <ListItemText primary={subName} />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() =>
                            handleOpen(null, { _id: subId, name: subName })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteSubcategory(subId)}
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
              <IconButton onClick={() => handleDeleteCategory(_id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleAddSubcategory(_id)}>
                <AddIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </List>

      {/* Edit Category or Subcategory Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentCategory
            ? "Edit Category"
            : currentSubcategory
            ? "Edit Subcategory"
            : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (currentCategory) {
                handleUpdateCategory();
              } else if (currentSubcategory) {
                handleUpdateSubcategory();
              } else {
                handleSaveNewCategory();
              }
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Category Dialog */}
      <Dialog open={openAddCategory} onClose={handleClose}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNewCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Subcategory Dialog */}
      <Dialog open={openAddSubcategory} onClose={handleClose}>
        <DialogTitle>Add New Subcategory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subcategory Name"
            type="text"
            fullWidth
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNewSubcategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this{" "}
            {currentCategory ? "category" : "subcategory"}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Display subCategory name if available */}
      {subCategory && (
        <Typography variant="body1" className="mt-4">
          Selected Subcategory: {getSubCategoryName(categories, subCategory)}
        </Typography>
      )}

      {/* Refresh Categories Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={loadCategories}
        className="mt-4"
      >
        Refresh Categories
      </Button>
    </div>
  );
};

export default Category;

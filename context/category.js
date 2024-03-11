// frontend for Category

"use client";

import { useState, createContext, useContext } from "react";
import toast from "react-hot-toast";

const CategoryContext = createContext();

const CatetoryProvider = ({ children }) => {
  // to create category
  const [name, setName] = useState(""); // string

  // for fetching all categories coming from db
  const [categories, setCategories] = useState([]); // array of objects

  // for update and delete
  const [updatingCategory, setUpdatingCategory] = useState(null); // object
  
  // const [updatingCategory, setUpdatingCategory] = useState({
  //   _id: "kdjkjajslgj",
  //   name: "Sportswear",
  // }); // object

  // create function out of  crud functions
  const createCategory = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      // console.log("created data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Category created");
        setName("");
        setCategories([data, ...categories]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Create category failed. Try again.");
    }
  };

  // list categories function, protected route for only loggedIn user
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/category`);

      const data = await response.json();
      // console.log("fetched datas ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Category List");
        setCategories(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Fetch categories failed. Try again.");
    }
  };

  // list categories function, route for any user including not loggedIn user
  const fetchCategoriesPublic = async () => {
    try {
      const response = await fetch(`${process.env.API}/categories`);

      const data = await response.json();
      // console.log("fetched datas ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Category List");
        setCategories(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Fetch categories failed. Try again.");
    }
  };

  // update category function
  const updateCategory = async () => {
    try {
      // can get id from updatingCategory in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingCategory),
        }
      );

      const data = await response.json();
      // console.log("deleted data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Category updated");
        // list updated category names
        // fetchCategories();

        // another way of listing updated category names
        setCategories(
          categories.map((category) =>
            category._id === updatingCategory._id ? data : category
          )
        );
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.log(err);
      toast.error("Update category failed. Try again.");
    }
  };

  // delete category function
  const deleteCategory = async () => {
    try {
      // can get id from updatingCategory in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/category/${updatingCategory?._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      // console.log("data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Category deleted");

       // listing updated category names
        setCategories(
          categories.filter((category) => category._id !== updatingCategory._id)
        );
        //fetchCategories();
        setUpdatingCategory(null);
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete category failed. Try again.");
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        name,
        setName,
        categories,
        setCategories,
        updatingCategory,
        setUpdatingCategory,
        createCategory,
        fetchCategories,
        fetchCategoriesPublic,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

const useCategory = () => useContext(CategoryContext);

export { CatetoryProvider, useCategory };

// const {
//   name,
//   setName,
//   categories,
//   setCategories,
//   updatingCategory,
//   setUpdatingCategory,
//   createCategory,
//   fetchCategories,
//   fetchCategoriesPublic,
//   updateCategory,
//   deleteCategory,
// } = useCategory();

// ---------------------------------------------------------------------------


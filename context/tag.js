// frontend for Tag

"use client";

import { useState, createContext, useContext } from "react";
import toast from "react-hot-toast";

const TagContext = createContext();

const TagProvider = ({ children }) => {
  // to create tag
  const [name, setName] = useState(""); // string
  const [parentCategory, setParentCategory] = useState(""); // _id: ObjectId('65af745b79ebc932faa968dc')

  // for fetching all tags coming from db
  const [tags, setTags] = useState([]); // array of objects

  // for update and delete
  const [updatingTag, setUpdatingTag] = useState(null); // object
  
  // const [updatingTag, setUpdatingTag] = useState({
  //   _id: "kdjkjajslgj",
  //   name: "ties",
  //   parentCategory: "Men's Wear"
  // }); // object

  // create function out of  crud functions
  const createTag = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentCategory }), // expecting parentCategory in api function
      });

      const data = await response.json();
      // console.log("created data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Tag created");
        setName("");
        // setParentCategory("");
        setTags([data, ...tags]); // array of tag object
      }
    } catch (err) {
      console.log(err);
      toast.error("Create tag failed. Try again.");
    }
  };

  // list tags function, protected route for only loggedIn user
  const fetchTags = async () => {
    try {
 
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // array of tag objects

      if (!response.ok) {
        toast.error(data);
      } else {
        setTags(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating tag");
    }
  };

  // list tags function, route for any user including not loggedIn user
  const fetchTagsPublic = async () => {
    try {
 
      const response = await fetch(`${process.env.API}/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json(); // array of tag objects

      if (!response.ok) {
        toast.error(data);
      } else {
        setTags(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error creating tag");
    }
  };

  // update tag function
  const updateTag = async () => {
    try {
      // can get id from updatingTag in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingTag),
        }
      );

      const data = await response.json();
      // console.log("deleted data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Tag updated");
        // list updated category names
        // fetchCategories();

        // another way of listing updated category names
        setTags(
          tags.map((tag) =>
            tag._id === updatingTag._id ? data : tag
          )
        );
        setUpdatingTag(null);
        setParentCategory("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Update tag failed. Try again.");
    }
  };

  // delete tag function
  const deleteTag = async () => {
    try {
      // can get id from updatingTag in the state when you click
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      // console.log("data ---->", data);

      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Tag deleted");
        setUpdatingTag(null);
        setParentCategory("");
       // listing updated tag names
        setTags((prevTags) =>
          prevTags.filter((tag) => tag._id !== updatingTag._id)
        );

      }
    } catch (err) {
      console.log(err);
      toast.error("Delete tag failed. Try again.");
    }
  };

  return (
    <TagContext.Provider
      value={{
        name,
        setName,
        parentCategory,
        setParentCategory,
        tags,
        setTags,
        updatingTag,
        setUpdatingTag,
        createTag,
        fetchTags,
        fetchTagsPublic,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

const useTag = () => useContext(TagContext);

export { TagProvider, useTag };

// const {
    // name,
    // setName,
    // parentCategory,
    // setParentCategory,
    // tags,
    // setTags,
    // updatingTag,
    // setUpdatingTag,
    // createTag,
    // fetchTags,
    // fetchTagsPublic,
    // updateTag,
    // deleteTag,
// } = useTag();

// ---------------------------------------------------------------------------


import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const handleAddTag = (e) => {
    setInputValue(e.target.value);
  };
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((tag) => tag !== index);
    setTags(newTags);
  }
  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-slate-200 text-black p-1 rounded flex items-center gap-2"
            >
              #{tag}
              <button onClick={() => {handleRemoveTag(tag)}}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          name="tags"
          id=""
          className="text-sm text-slate-950 border outline-none bg-slate-100 rounded p-2"
          placeholder="Add tags"
          onChange={handleAddTag}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border-blue-700 hover:bg-blue-700"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;

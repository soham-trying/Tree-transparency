import { useState } from 'react';

export default function TreeForm() {
  const [treeInfo, setTreeInfo] = useState({ name: '', type: '', location: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTreeInfo({ ...treeInfo, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission here
    console.log(treeInfo);
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div className="w-full form-control">
      <label>
        Tree Name:
        <input type="text" name="name" value={treeInfo.name} onChange={handleChange} />
      </label>
      <label>
        Tree Type:
        <input type="text" name="type" value={treeInfo.type} onChange={handleChange} />
      </label>
      </div>
      <div>
      <label>
        Tree Location:
        <input type="text" name="location" value={treeInfo.location} onChange={handleChange} />
      </label>
      <div >
      <div className="w-full form-control">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
      </div>
      </div>
      </div>
    </form>
    </div>
  );
}

import { Inside, Shapes } from "../types"

function Solver() {
  

  return (
    <div>
      {/* Input Inside */}
      {/* Input Outside */}
      {/* Input Show Result */}
    </div>
  )
}

function InsideInput({inside,setInside}:{inside:Inside,setInside: (shapes:Inside) => void}) {
  function setShape(index:number) {
    return (shape:Shapes) => {
      const arr:Inside = [...inside];
      arr[index] = shape;
      setInside(arr);
    }
  }

  return (
    <div>
      <h1>Inside</h1>
    </div>
  )
}

function InsideCell({shape,setShape}:{shape:Shapes,setShape: (shape:Shapes) => void}) {
  return (
    <div>
      {Object.values(Shapes).map((s) => (
        <button onClick={() => setShape(s)}>{s}</button>
      ))}
    </div>
  )
}
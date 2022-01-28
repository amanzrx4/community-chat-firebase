import { useState } from 'react';

export default function Counter() {
  const [state, setState] = useState({
    name: "aman",
    age: []
  });

  function handleClick() {
    const firstArray = [1, 2, 3];
    const secondArray = [4, 5, 6];
    setState(prev => ({ ...prev, age: firstArray}));
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}

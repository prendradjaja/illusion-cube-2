import './App.css';
import { MouseEvent } from 'react';

function App() {
  function handleClick(cubeId: 1 | 2, moveName: string, e: MouseEvent): void {
  }

  return (
    <>
      <div id="cubes-container"></div>
      <div id="controls">
        <div>
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(1, 'U', event)}>U</button
          ><button className="spacer">-</button>
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'L', event)}>L</button
          ><button onMouseDown={(event) => handleClick(1, 'F', event)}>F</button
          ><button onMouseDown={(event) => handleClick(1, 'R', event)}>R</button>
          <br />
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(1, 'D', event)}>D</button
          ><button onMouseDown={(event) => handleClick(1, 'B', event)}>B</button>
          <br />
          <br />
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'M', event)}>M</button
          ><button onMouseDown={(event) => handleClick(1, 'E', event)}>E</button
          ><button onMouseDown={(event) => handleClick(1, 'S', event)}>S</button>
          <br />
          <button  onMouseDown={(event) => handleClick(1, 'x', event)}>x</button
          ><button onMouseDown={(event) => handleClick(1, 'y', event)}>y</button
          ><button onMouseDown={(event) => handleClick(1, 'z', event)}>z</button>
        </div>
        <div>
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(2, 'U', event)}>U</button
          ><button className="spacer">-</button>
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'L', event)}>L</button
          ><button onMouseDown={(event) => handleClick(2, 'F', event)}>F</button
          ><button onMouseDown={(event) => handleClick(2, 'R', event)}>R</button>
          <br />
          <button className="spacer">-</button
          ><button onMouseDown={(event) => handleClick(2, 'D', event)}>D</button
          ><button onMouseDown={(event) => handleClick(2, 'B', event)}>B</button>
          <br />
          <br />
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'M', event)}>M</button
          ><button onMouseDown={(event) => handleClick(2, 'E', event)}>E</button
          ><button onMouseDown={(event) => handleClick(2, 'S', event)}>S</button>
          <br />
          <button  onMouseDown={(event) => handleClick(2, 'x', event)}>x</button
          ><button onMouseDown={(event) => handleClick(2, 'y', event)}>y</button
          ><button onMouseDown={(event) => handleClick(2, 'z', event)}>z</button>
        </div>
      </div>
    </>
  );
}

export default App;

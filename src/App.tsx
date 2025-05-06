import "./App.css";
import Grid from "./components/Grid";

function App() {
	return (
		<div className="App">
			<Grid rows={38} cols={38} backgroundColor="black" strokeColor="white" />
		</div>
	);
}

export default App;

import AutoComplete from './components/AutoComplete';
import suggestions from './utils/suggestions';

const App = () => {
  return <AutoComplete suggestions={suggestions} />;
};

export default App;

import DefaultLayout from '#Layouts/DefaultLayout';
import { Aside } from '#Features/sidebar/Aside';
import Header from '#Features/header/Header';
import Main from './ui/Main';

function App(): JSX.Element {
  return (
    <>
      <DefaultLayout aside={<Aside />} header={<Header />} main={<Main />} />
    </>
  );
}

export default App;

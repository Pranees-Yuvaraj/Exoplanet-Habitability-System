import StarFieldBackground from './components/StarFieldBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Motivation from './components/Motivation';
import Formula from './components/Formula';
import ParameterCards from './components/ParameterCards';
import Dashboard from './components/Dashboard';
import Critique from './components/Critique';
import Explorer from './components/Explorer';
import Timeline from './components/Timeline';
import Limitations from './components/Limitations';
import FutureWork from './components/FutureWork';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <StarFieldBackground />
      <Nav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Motivation />
        <Formula />
        <ParameterCards />
        <Dashboard />
        <Critique />
        <Explorer />
        <Timeline />
        <Limitations />
        <FutureWork />
      </main>
      <Footer />
    </>
  );
}

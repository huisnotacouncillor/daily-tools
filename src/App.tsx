import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { RegexValidator } from '@/pages/RegexValidator';
import { JsonFormatter } from '@/pages/JsonFormatter';
import { ColorConverter } from '@/pages/ColorConverter';
import { JwtDecoder } from '@/pages/JwtDecoder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="regex" element={<RegexValidator />} />
          <Route path="json" element={<JsonFormatter />} />
          <Route path="color" element={<ColorConverter />} />
          <Route path="jwt" element={<JwtDecoder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

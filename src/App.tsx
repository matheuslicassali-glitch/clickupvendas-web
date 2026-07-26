import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './contexts/StoreContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Financeiro from './pages/Financeiro'
import Caixas from './pages/Caixas'
import Vendas from './pages/Vendas'
import Relatorios from './pages/Relatorios'
import Estoque from './pages/Estoque'
import Clientes from './pages/Clientes'
import Funcionarios from './pages/Funcionarios'
import Fornecedores from './pages/Fornecedores'
import Configuracoes from './pages/Configuracoes'
import Lojas from './pages/Lojas'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="caixas" element={<Caixas />} />
            <Route path="vendas" element={<Vendas />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="fornecedores" element={<Fornecedores />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="lojas" element={<Lojas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

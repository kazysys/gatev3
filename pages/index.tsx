const Home = () => {
    return (
      <div>
        <h1>Painel de Administração</h1>
        <nav>
          <ul>
            <li><a href="/admin/add-machine">Adicionar Máquina</a></li>
            <li><a href="/admin/assign-machine">Associar Máquina</a></li>
            <li><a href="/admin/user-dashboard">Dashboard do Usuário</a></li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default Home;
  
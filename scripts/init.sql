START TRANSACTION;

SET SQL_MODE = "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION,NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Banco de dados: `cache`
--
CREATE DATABASE IF NOT EXISTS `cache` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `cache`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `codCliente` int NOT NULL,
  `codEmpresa` int NOT NULL,
  `cnpjCpf` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `inscEstadual` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `razaoSocial` varchar(255) NOT NULL,
  `nomeFantasia` varchar(255) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `endereco` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `numeroEndereco` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bairro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cidade` varchar(255) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `codigoIbge` varchar(15) DEFAULT NULL,
  `telefone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dataRegistro` date DEFAULT NULL,
  `situacao` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente_empresa`
--

CREATE TABLE `cliente_empresa` (
  `id` varchar(50) NOT NULL,
  `codEmpresa` int DEFAULT NULL,
  `codigo` int NOT NULL,
  `cnpjCpf` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `inscEstadual` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `razaoSocial` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nomeFantasia` varchar(200) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `endereco` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `numeroEndereco` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bairro` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `codigoIbge` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `telefone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `situacao` tinyint(1) NOT NULL,
  `tipoCadastro` varchar(1) NOT NULL,
  `dataRegistro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `empresa`
--

CREATE TABLE `empresa` (
  `id` int NOT NULL,
  `cnpjCpf` varchar(254) NOT NULL,
  `inscEstadual` varchar(20) NOT NULL,
  `razaoSocial` varchar(254) NOT NULL,
  `nomeFantasia` varchar(254) NOT NULL,
  `cep` varchar(9) NOT NULL,
  `endereco` varchar(254) NOT NULL,
  `numeroEndereco` varchar(10) NOT NULL,
  `bairro` varchar(254) NOT NULL,
  `cidade` varchar(254) NOT NULL,
  `estado` varchar(254) NOT NULL,
  `codigoIbge` varchar(15) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `dataRegistro` date NOT NULL,
  `situacao` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `fornecedor`
--

CREATE TABLE `fornecedor` (
  `id` varchar(50) NOT NULL,
  `codigo` int NOT NULL,
  `codEmpresa` int NOT NULL,
  `cnpjCpf` varchar(20) NOT NULL,
  `inscEstadual` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `razaoSocial` varchar(255) NOT NULL,
  `nomeFantasia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cep` varchar(20) NOT NULL,
  `endereco` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `numeroEndereco` varchar(50) NOT NULL,
  `bairro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cidade` varchar(255) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `codigoIbge` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dataRegistro` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `item`
--

CREATE TABLE `item` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `marca` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `unidMedida` varchar(3) NOT NULL,
  `peso` decimal(18,3) NOT NULL,
  `qtdEmbalagem` decimal(18,3) NOT NULL,
  `mascara` varchar(20) NOT NULL,
  `ncm` varchar(8) NOT NULL,
  `tipo` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dataCriacao` date NOT NULL,
  `dataAlteracao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itemNotaFiscal`
--

CREATE TABLE `itemNotaFiscal` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `idEmpresa` int NOT NULL,
  `idEmitente` varchar(20) NOT NULL,
  `codEmitente` int NOT NULL,
  `numeroNota` int NOT NULL,
  `serieNota` int NOT NULL,
  `codigo` int NOT NULL,
  `vlrCustoEntradaUnitario` decimal(18,4) NOT NULL,
  `vlrUnitario` decimal(18,4) NOT NULL,
  `vlrTotal` decimal(18,4) NOT NULL,
  `qtd` decimal(18,3) NOT NULL,
  `cfop` varchar(4) NOT NULL,
  `vlrDesconto` decimal(18,4) NOT NULL,
  `vlrCofins` decimal(18,4) NOT NULL,
  `vlrIcms` decimal(18,4) NOT NULL,
  `vlrPis` decimal(18,4) NOT NULL,
  `vlrTributoNfc` decimal(18,4) NOT NULL,
  `vlrIpi` decimal(18,4) NOT NULL,
  `tipoNota` varchar(1) NOT NULL,
  `dataEmissao` date DEFAULT NULL,
  `dataEntrada` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacao`
--

CREATE TABLE `movimentacao` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `codEmpresa` int NOT NULL,
  `idFornecedor` varchar(50) NOT NULL,
  `codFornecedor` int DEFAULT NULL,
  `codNatureza` int NOT NULL,
  `tipoNota` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `numeroNota` int NOT NULL,
  `serieFiscal` int NOT NULL DEFAULT '1',
  `codItem` int NOT NULL,
  `qtdItem` decimal(18,3) NOT NULL,
  `vlrUnitario` decimal(18,4) NOT NULL,
  `operacao` tinyint(1) NOT NULL,
  `dataLancamento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `naturezaOperacao`
--

CREATE TABLE `naturezaOperacao` (
  `id` int NOT NULL,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `notaFiscal`
--

CREATE TABLE `notaFiscal` (
  `id` varchar(50) NOT NULL,
  `codEmpresa` int NOT NULL,
  `idEmitente` varchar(50) NOT NULL,
  `codEmitente` int NOT NULL,
  `idDestinatario` varchar(50) NOT NULL,
  `codDestinatario` int NOT NULL,
  `codPedido` int DEFAULT NULL,
  `numero` int NOT NULL,
  `serie` int NOT NULL,
  `chave` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `idNatOperacao` int DEFAULT NULL,
  `codNatOperacao` int NOT NULL,
  `nomeNatOperacao` varchar(50) NOT NULL,
  `descNatOperacao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `situacao` tinyint(1) NOT NULL,
  `dataEmissao` date NOT NULL,
  `dataEntrada` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `notaFiscalDevolucao`
--

CREATE TABLE `notaFiscalDevolucao` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `idEmpresa` int NOT NULL,
  `idEmitenteDevolucao` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `notaDevolucao` int NOT NULL,
  `serieDevolucao` int NOT NULL,
  `idDestinatarioDevolucao` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `notaReferenciada` int NOT NULL,
  `serieReferenciada` int NOT NULL,
  `dataDevolucao` date NOT NULL,
  `dataNotaReferenciada` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codEmpresa` (`codEmpresa`,`codCliente`);

--
-- Índices de tabela `cliente_empresa`
--
ALTER TABLE `cliente_empresa`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `fornecedor`
--
ALTER TABLE `fornecedor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codEmpresa` (`codEmpresa`,`codigo`);

--
-- Índices de tabela `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `itemNotaFiscal`
--
ALTER TABLE `itemNotaFiscal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `movimentacao`
--
ALTER TABLE `movimentacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codEmpresa` (`codEmpresa`,`numeroNota`,`serieFiscal`);

--
-- Índices de tabela `naturezaOperacao`
--
ALTER TABLE `naturezaOperacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `notaFiscal`
--
ALTER TABLE `notaFiscal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `notaFiscalDevolucao`
--
ALTER TABLE `notaFiscalDevolucao`
  ADD PRIMARY KEY (`id`);

COMMIT;


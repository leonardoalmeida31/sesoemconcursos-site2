import React from "react";

const PoliticaPrivacidade = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>

      <p className="mb-4">
        Bem-vindo à Política de Privacidade do <strong>SESO em Concursos</strong>, plataforma de simulados de questões de concursos da área de Serviço Social. Prezamos pela sua privacidade e segurança, e respeitamos a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Dados que coletamos</h2>
      <p className="mb-4">
        Durante seu uso no site e aplicativo, coletamos os seguintes dados:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Nome completo</li>
        <li>E-mail</li>
        <li>Foto de perfil (opcional)</li>
        <li>Informações de pagamento (processadas via intermediadoras seguras — não armazenamos dados completos de cartão)</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">2. Finalidade do uso dos dados</h2>
      <p className="mb-4">
        Utilizamos seus dados para:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Criar e gerenciar sua conta</li>
        <li>Identificação do usuário dentro da plataforma</li>
        <li>Processar assinaturas via cartão ou Pix</li>
        <li>Envio de comunicados, avisos e conteúdos relacionados ao site/app</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">3. Compartilhamento de dados</h2>
      <p className="mb-4">
        Seus dados poderão ser compartilhados apenas com:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Plataformas de pagamento (ex: intermediadoras de cartão e Pix)</li>
        <li>Serviços de hospedagem e segurança da informação</li>
        <li>Autoridades legais, em caso de obrigação judicial</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">4. Seus direitos</h2>
      <p className="mb-4">
        Conforme a LGPD, você pode a qualquer momento:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Acessar seus dados</li>
        <li>Corrigir dados incorretos</li>
        <li>Solicitar exclusão dos seus dados</li>
        <li>Revogar consentimento</li>
      </ul>
      <p className="mb-4">
        Para exercer seus direitos, entre em contato pelo e-mail: <a href="mailto:contato@sesoemconcursos.com.br" className="text-blue-500">leonardoalmeida10515@gmail.com</a>
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Segurança dos dados</h2>
      <p className="mb-4">
        O SESO em Concursos adota práticas de segurança adequadas para proteger seus dados pessoais contra acessos não autorizados, perda, divulgação ou alteração indevida.
      </p>

      <h2 className="text-2xl font-semibold mb-2">6. Atualizações desta política</h2>
      <p className="mb-4">
        Esta Política de Privacidade poderá ser atualizada periodicamente. Sempre que isso acontecer, publicaremos a nova versão neste mesmo local.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Última atualização: 07 de abril de 2025.
      </p>
    </div>
  );
};

export default PoliticaPrivacidade;

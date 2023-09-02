// import React, { useState } from "react";
// import pix from "./assets/WhatsApp Image 2023-08-31 at 16.40.43.jpeg";

// function Pay({ onClose }) {
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleClose = () => {
//     onClose();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const paymentForm = document.getElementById("paymentForm");
//     const formData = new FormData(paymentForm);

//     try {
//       const response = await fetch("/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         alert("Imagem do pagamento enviada com sucesso!");
//         paymentForm.reset();
//         setErrorMessage("");
//       } else {
//         setErrorMessage("Erro ao enviar a imagem do pagamento.");
//       }
//     } catch (error) {
//       console.error("Erro:", error);
//       setErrorMessage("Ocorreu um erro ao enviar a imagem do pagamento.");
//     }
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>
//           Para realizar Assinatura por um mês e ter acesso a todas as questões
//           de forma ilimitada, é só realizar o pagamento via pix e fazer o
//           preenchimento do formulário
//         </h2>
//         <span className="close" onClick={handleClose}>
//           &times;
//         </span>
//         <img src={pix} alt="" />
//       </div>
//       <div className="container">
//         <h1>Envie a imagem do pagamento</h1>
//         {errorMessage && <p className="error">{errorMessage}</p>}
//         <form
//           id="paymentForm"
//           encType="multipart/form-data"
//           onSubmit={handleSubmit}
//         >
//           <input
//             type="file"
//             id="paymentImage"
//             name="paymentImage"
//             accept="image/*"
//             required
//           />
//           <button type="submit">Enviar</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Pay;

import React from "react";

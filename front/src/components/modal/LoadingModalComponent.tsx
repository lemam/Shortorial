import { Modal } from "react-bootstrap";
import loading from "../../assets/challenge/loading.gif";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface ModalType {
  progress: string;
  showModal: boolean;
  handleCloseModal: () => void;
}

const ModalComponent = ({ progress, showModal, handleCloseModal }: ModalType) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Body>
        <LoadingComponent>
          <LoadingImg src={loading} />
          <div>{progress}</div>
        </LoadingComponent>
      </Modal.Body>
    </Modal>
  );
};

const LoadingComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingImg = styled.img`
  width: 50px;
  height: 50px;
`;

export default ModalComponent;

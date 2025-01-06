import React, { useEffect, useState } from "react";
import { message, Input, Spin } from "antd";
import apiClient from "../../services/apiClient";
import "../../styles/tableStyles.scss";
import "../../styles/modalStyles.scss";
import RContract from "../../components/contracts/RContract";

const Contract = () => {
  const [contractDetail, setContractDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContract = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/tenant/contract");
      setContractDetail(response);
    } catch (error) {
      if (error?.message) message.error(error.message);
      console.error("Error fetching contract detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <RContract
          contractDetail={contractDetail}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </>
  );
};

export default Contract;

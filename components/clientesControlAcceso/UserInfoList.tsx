import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";

interface ValidPeriod {
  beginTime: string;
  endTime: string;
  enable: boolean;
  timeType: string;
}

export interface UserInfo {
  employeeNo: string;
  name: string;
  userType: string;
  faceURL: string;
  belongGroup: string;
  Valid: ValidPeriod;
  // add other fields as needed
}

// Nuevo componente para descargar y mostrar cada imagen
const ImageCell: React.FC<{ remoteUrl: string }> = ({ remoteUrl }) => {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    const fetchUserImage = async () => {
      try {
        const res = await fetch("/api/userImagen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ remoteUrl }),
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const blob = await res.blob();
        if (mounted) setImgSrc(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };
    fetchUserImage();
    return () => {
      mounted = false;
    };
  }, [remoteUrl]);

  return <Avatar image={imgSrc} size="large" shape="circle" />;
};

const UserInfoList: React.FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userImageUrl, setUserImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("/api/userinfo", { method: "POST" });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = (await res.json()) as {
          UserInfoSearch: { UserInfo: UserInfo[] };
        };
        const list = json.UserInfoSearch?.UserInfo || [];
        setUsers(list);
      } catch (err) {
        console.error("Error loading user info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  // Reemplazamos faceBody para usar el nuevo componente
  const faceBody = (row: UserInfo) => <ImageCell remoteUrl={row.faceURL} />;

  return (
    <DataTable value={users} loading={loading} responsiveLayout="scroll">
      <Column header="Foto" body={faceBody} style={{ width: "80px" }} />
      <Column field="employeeNo" header="ID" sortable />
      <Column field="name" header="Nombre" sortable />
      <Column field="userType" header="Tipo" sortable />
      <Column field="belongGroup" header="Grupo" />
      <Column
        field="Valid.beginTime"
        header="Válido Desde"
        body={(row) => new Date(row.Valid.beginTime).toLocaleDateString()}
      />
      <Column
        field="Valid.endTime"
        header="Válido Hasta"
        body={(row) => new Date(row.Valid.endTime).toLocaleDateString()}
      />
      <Column
        header="Activo"
        body={(row) => (row.Valid.enable ? "Sí" : "No")}
        style={{ textAlign: "center", width: "100px" }}
      />
    </DataTable>
  );
};

export default UserInfoList;

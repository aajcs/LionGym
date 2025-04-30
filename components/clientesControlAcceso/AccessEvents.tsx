import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

interface AccessEvent {
  major: number;
  minor: number;
  time: string;
  cardNo: string;
  name: string;
  serialNo: number;
  pictureURL?: string;
  [key: string]: any;
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

export default function AccessEvents() {
  const [events, setEvents] = useState<AccessEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessEvents = async () => {
      try {
        const res = await fetch("/api/eventos-acceso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = (await res.json()) as {
          AcsEvent: { InfoList: AccessEvent[] };
        };
        setEvents(json.AcsEvent.InfoList || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessEvents();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>Error: {error}</p>;
  const photoBody = (row: AccessEvent) =>
    row.pictureURL ? (
      <ImageCell remoteUrl={row.pictureURL} />
    ) : (
      <Avatar icon="pi pi-user" shape="circle" size="large" />
    );

  const timeBody = (row: AccessEvent) => new Date(row.time).toLocaleString();

  return (
    <Card title="Eventos de Acceso" className="p-mb-4">
      <DataTable
        value={events}
        loading={loading}
        responsiveLayout="scroll"
        className="p-datatable-sm"
      >
        <Column
          header="Foto"
          body={photoBody}
          style={{ width: "80px", textAlign: "center" }}
        />
        <Column field="name" header="Nombre" sortable />
        <Column
          header="Fecha / Hora"
          body={timeBody}
          sortable
          style={{ width: "180px" }}
        />
        <Column field="serialNo" header="Serial No." sortable />
        {/* <Column field="cardNo" header="Tarjeta" />
        <Column field="major" header="Major" style={{ width: "80px" }} />
        <Column field="minor" header="Minor" style={{ width: "80px" }} /> */}
      </DataTable>
    </Card>
  );
}

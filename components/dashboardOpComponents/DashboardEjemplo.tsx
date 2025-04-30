"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { ChartData, ChartOptions } from "chart.js";
import { LayoutContext } from "../../layout/context/layoutcontext";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import UserInfoList from "../clientesControlAcceso/UserInfoList";

const DashboardEjemplo = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [userImageUrl, setUserImageUrl] = useState<string>("");

  const weeks = [
    { name: "Semana Pasada", code: "0" },
    { name: "Esta Semana", code: "1" },
  ];

  const members = [
    { name: "Carlos López", membership: "Premium", lastCheckin: "Hace 2h" },
    { name: "Ana Martínez", membership: "Básica", lastCheckin: "Hace 4h" },
    { name: "Pedro Sánchez", membership: "VIP", lastCheckin: "Ayer" },
  ];
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/userinfo", { method: "POST" });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const res = await fetch("/api/userImagen", { method: "POST" });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setUserImageUrl(url);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, []);

  useEffect(() => {
    setAttendanceData({
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [
        {
          label: "Asistencia",
          data: [45, 60, 75, 55, 80, 65, 90],
          borderColor: "#3B82F6",
          tension: 0.4,
          fill: false,
        },
      ],
    });
  }, []);

  return (
    <div className="grid">
      {/* Estadísticas Principales */}
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card p-3 text-center">
          <h6>Imagen de Usuario</h6>
          {userImageUrl ? (
            <img src={userImageUrl} alt="User" className="w-full h-auto" />
          ) : (
            <span>Cargando imagen...</span>
          )}
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card p-0 overflow-hidden flex flex-column">
          <div className="flex align-items-center p-3">
            <i className="pi pi-users text-6xl text-blue-500"></i>
            <div className="ml-3">
              <span className="text-blue-500 block">MIEMBROS ACTIVOS</span>
              <span className="text-blue-500 text-4xl font-bold">1,245</span>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400"
            className="w-full"
            alt="members"
          />
        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card p-0 overflow-hidden flex flex-column">
          <div className="flex align-items-center p-3">
            <i className="pi pi-check-circle text-6xl text-green-500"></i>
            <div className="ml-3">
              <span className="text-green-500 block">CHECK-INS HOY</span>
              <span className="text-green-500 text-4xl font-bold">189</span>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400"
            className="w-full"
            alt="checkins"
          />
        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card p-0 overflow-hidden flex flex-column">
          <div className="flex align-items-center p-3">
            <i className="pi pi-heart text-6xl text-red-500"></i>
            <div className="ml-3">
              <span className="text-red-500 block">CLASES HOY</span>
              <span className="text-red-500 text-4xl font-bold">24</span>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400"
            className="w-full"
            alt="classes"
          />
        </div>
      </div>

      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card h-full p-0 overflow-hidden flex flex-column">
          <div className="flex align-items-center p-3">
            <div className="relative" style={{ width: "80px", height: "80px" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="10"
                  strokeDasharray="220"
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <span className="absolute top-50 left-50 translate-x--50 translate-y--50 text-xl font-bold text-blue-500">
                2.3h
              </span>
            </div>
            <div className="ml-3">
              <span className="text-purple-500 block">PROMEDIO DIARIO</span>
              <div className="flex flex-column">
                <span className="text-sm text-color-secondary">
                  +15% vs semana pasada
                </span>
                <i className="pi pi-arrow-up text-green-500"></i>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3">
            <div className="flex flex-column gap-2">
              <span className="text-sm text-color-secondary">
                Distribución por horario:
              </span>
              <div className="flex h-1rem">
                <div
                  className="bg-primary-100"
                  style={{ width: "30%", borderRadius: "6px 0 0 6px" }}
                ></div>
                <div className="bg-primary-300" style={{ width: "50%" }}></div>
                <div
                  className="bg-primary-500"
                  style={{ width: "20%", borderRadius: "0 6px 6px 0" }}
                ></div>
              </div>

              {/* Leyenda */}
              <div className="flex justify-content-between text-sm">
                <div className="flex align-items-center">
                  <span className="inline-block w-1rem h-1rem bg-primary-100 mr-1"></span>
                  <span>Mañana</span>
                </div>
                <div className="flex align-items-center">
                  <span className="inline-block w-1rem h-1rem bg-primary-300 mr-1"></span>
                  <span>Tarde</span>
                </div>
                <div className="flex align-items-center">
                  <span className="inline-block w-1rem h-1rem bg-primary-500 mr-1"></span>
                  <span>Noche</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Asistencia */}
      <div className="col-12 xl:col-8">
        <div className="card h-full">
          <div className="flex justify-content-between align-items-center mb-3">
            <h5>Asistencia Semanal</h5>
            <Dropdown
              options={weeks}
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.value)}
              optionLabel="name"
            />
          </div>
          <Chart
            type="line"
            height="400px"
            data={attendanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      {/* Miembros Recientes */}
      <div className="col-12 xl:col-4">
        <div className="card h-full">
          <h5>Últimos Check-ins</h5>
          <ul className="list-none p-0 m-0">
            {members.map((member, index) => (
              <li key={index} className="mb-4 flex align-items-center">
                <Avatar
                  label={member.name[0]}
                  size="large"
                  shape="circle"
                  className="font-bold"
                  style={{ backgroundColor: "#e2e8f0", color: "#64748b" }}
                />
                <div className="ml-3">
                  <span className="block font-bold">{member.name}</span>
                  <span className="text-color-secondary block">
                    {member.membership}
                  </span>
                  <span className="text-color-secondary text-sm">
                    {member.lastCheckin}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Estadísticas de Clases */}
      <div className="col-12 lg:col-6 xl:col-4">
        <div className="card h-full">
          <h5>Participación en Clases</h5>
          <div className="flex flex-column gap-3">
            <div>
              <div className="flex justify-content-between mb-2">
                <span>Yoga</span>
                <span className="font-bold">65%</span>
              </div>
              <ProgressBar value={65} className="h-1rem" />
            </div>
            <div>
              <div className="flex justify-content-between mb-2">
                <span>CrossFit</span>
                <span className="font-bold">85%</span>
              </div>
              <ProgressBar value={85} className="h-1rem" />
            </div>
            <div>
              <div className="flex justify-content-between mb-2">
                <span>Spinning</span>
                <span className="font-bold">75%</span>
              </div>
              <ProgressBar value={75} className="h-1rem" />
            </div>
          </div>
        </div>
      </div>

      {/* Horario de Clases */}
      <div className="col-12 lg:col-6 xl:col-4">
        <div className="card h-full">
          <h5>Próximas Clases</h5>
          <ul className="list-none p-0 m-0">
            <li className="flex align-items-center justify-content-between py-3 border-bottom-1 surface-border">
              <div>
                <span className="block font-bold">Yoga Matutino</span>
                <span className="text-color-secondary">08:00 AM</span>
              </div>
              <Tag value="15 plazas" severity="success" />
            </li>
            <li className="flex align-items-center justify-content-between py-3 border-bottom-1 surface-border">
              <div>
                <span className="block font-bold">CrossFit Avanzado</span>
                <span className="text-color-secondary">12:30 PM</span>
              </div>
              <Tag value="Lleno" severity="danger" />
            </li>
            <li className="flex align-items-center justify-content-between py-3">
              <div>
                <span className="block font-bold">Spinning Nocturno</span>
                <span className="text-color-secondary">07:00 PM</span>
              </div>
              <Tag value="8 plazas" severity="warning" />
            </li>
          </ul>
        </div>
      </div>

      {/* Equipo Más Usado */}
      <div className="col-12 lg:col-6 xl:col-4">
        <div className="card h-full">
          <h5>Equipo Popular</h5>
          <div className="flex flex-column align-items-center mt-5">
            <img
              src="/demo/images/dashboard/cintaDeCorrer.png"
              alt="equipment"
              className="w-9"
            />
            <span className="text-xl font-bold mt-3">Cintas de Correr</span>
            <span className="text-color-secondary">1,450 usos esta semana</span>
          </div>
        </div>
      </div>

      <div className="col-12 ">
        <div className="card h-full">
          <h5>Lista de Clientes Resitrados</h5>
          <UserInfoList />
        </div>
      </div>
    </div>
  );
};

export default DashboardEjemplo;

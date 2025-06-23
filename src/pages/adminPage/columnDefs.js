import { Box,Typography } from "@mui/material"

/*export const createColumnDefs = (ButtonRenderer) => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 50,
      minWidth: 50,
      pinned: "left",
      filter: false,

      suppressMenu: true,
    },
    {
      headerName: "",
      field: "",
      maxWidth: 50,
      minWidth: 50,
      cellRenderer: "agGroupCellRenderer",
      filter: false,
      suppressMenu: true,
    },
    {
      headerName: "Detay",
      field: "actions",
      width: 70,
      cellRenderer: ButtonRenderer,
      filter: false,
      suppressMenu: true,
    },

    {
      field: "faturaNo",
      headerName: "Fatura No",
      filter: "agTextColumnFilter",
    }, {
      field: "faturaProfili",
      headerName: "Fatura Profili",
      filter: "agTextColumnFilter",
    },
    { field: "tip", headerName: "Tip", filter: "agTextColumnFilter" },
    { field: "tarih", headerName: "Tarih", filter: "agDateColumnFilter" },
    {
      field: "gondericiVkn",
      headerName: "Gönderici VKN",
      filter: "agTextColumnFilter",
    },
    {
      field: "gondericiUnvan",
      headerName: "Gönderici Ünvan",
      filter: "agTextColumnFilter",
    },
    {
      field: "aliciVkn",
      headerName: "Alıcı VKN",
      filter: "agTextColumnFilter",
    },
    {
      field: "aliciUnvan",
      headerName: "Alıcı Ünvan",
      filter: "agTextColumnFilter",
    },
]*/
export const createColumnDefs = (ButtonRenderer) => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 50,
      minWidth: 50,
      pinned: "left",
      filter: false,

      suppressMenu: true,
    },
    {
      field: "id",
      headerName: "id",
      filter: "agTextColumnFilter",
    },
    { 
      field: "name",
      headerName: "Adı",
      filter: "agTextColumnFilter"
    },
    {
      field: "created_at",
      headerName: "Kayıt Tarihi", 
      filter: "agDateColumnFilter" ,
      valueGetter: (params) => {
        return `${String(params.data.created_at).split("T")[0]}`;
      },
    },
    {
      field: "email",
      headerName: "Email",
      filter: "agTextColumnFilter",
    },
    {
      field: "status",
      headerName: "Durumu",
      width:20,
      filter: "agTextColumnFilter",
      valueGetter: (params) => {
        return `${params.data.status?'Aktif':'Pasif'}`;
      },
    },
    {
      field: "role",
      headerName: "Yetkisi",
      width:20,
      filter: "agTextColumnFilter",
    },
    {
      field: "isEmailVerified",
      headerName: "Email Doğrulaması",
      filter: "agTextColumnFilter",
      valueGetter: (params) => {
        return `${params.data.isEmailVerified?'Onaylı':'Onaylı Değil'}`;
      },
    },
    {
      headerName: "Kullanıcı Detayı",
      field: "actions",
      width: 70,
      cellRenderer: ButtonRenderer,
      cellRendererParams:{
        USER_DETAIL: true,
      },
      filter: false,
      suppressMenu: true,
    },    
    {
      field: "monitor",
      headerName: "İzleme Listesi",
      cellRenderer: ButtonRenderer,
      cellRendererParams: {
       MONITORS: true,
      },
      filter: false,
    },
  ]
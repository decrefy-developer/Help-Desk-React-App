import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const ExportExcel = (details: any) => {

    const fileType = 'xlsx'

    const ws = XLSX.utils.json_to_sheet(details)
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] }
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, "Tickets" + ".xlsx")
}

export default ExportExcel
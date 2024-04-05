import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableData } from "./table/table-data";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Attendee {
  id: string
  name: string
  email: string
  createdAt: string
  checkedInAt: string | null
}

export function AttendeeList() {
  const [ search, setSearch ] = useState(() => {
    const url = new URL(window.location.toString())
    
    if(url.searchParams.has('search')){
      return url.searchParams.get('search') ?? ''
    }
    return ''
  })
  const [ page, setPage ] = useState(() => {
    const url = new URL(window.location.toString())
    
    if(url.searchParams.has('page')){
      return Number(url.searchParams.get('page'))
    }
    return 1
  
  })
  const [ total, setTotal ] = useState(0)
  const [ attendees, setAttendees ] = useState<Attendee[]>([])

  const totalPages = Math.ceil(total/10)

  useEffect(() => {
    const url = new URL('http://localhost:5001/api/event/9e9bd979-9d10-4915-b339-3786b1634f33/attendees') 
    url.searchParams.set('pageIndex', String(page - 1))
    if(search.length > 0){
      url.searchParams.set('query', search)
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees)
        setTotal(data.total)
      })
  }, [page, search])

  function setCurrentSearch(search: string){
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)
    setSearch(search)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)
    setPage(page)
  }
  
  function backToFirstPage(){
    setCurrentPage(1)
  }
  function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>){
    setCurrentSearch(event.target.value)
    backToFirstPage()
  }

  function goToNextPage(){
    setCurrentPage(page + 1)
  }
  
  function backPreviousPage(){
    setCurrentPage(page - 1)
  }

  function goToLastPage(){
    setCurrentPage(totalPages)
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Patricipantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input 
            onChange={onSearchInputChanged} 
            value={search}
            className="bg-transparent flex-1 outline-none h-autp border-0 p-0 text-sm focus-ring-0" 
            placeholder="Buscar participante... "
          />
        </div>
      </div>
      <Table className="w-full">
        <thead>
          <TableRow className="border-b border-white/10">
            <TableHeader style={{ width: 64 }} className="py-3 px-4 text-sm font-semibold text-left">
              <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10"/>
            </TableHeader>
            <TableHeader className="py-3 px-4 text-sm font-semibold text-left">Código</TableHeader>
            <TableHeader className="py-3 px-4 text-sm font-semibold text-left">Participante</TableHeader>
            <TableHeader className="py-3 px-4 text-sm font-semibold text-left">Data da inscrição</TableHeader>
            <TableHeader className="py-3 px-4 text-sm font-semibold text-left">Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }} className="py-3 px-4 text-sm font-semibold text-left"></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map(attendee => {
            return(
              <TableRow className="border-b border-white/10" key={attendee.id}>
                <TableData className="py-3 px-4 text-sm text-zinc-300">
                <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10"/>
                </TableData>
                <TableData className="py-3 px-4 text-sm text-zinc-300">{attendee.id}</TableData>
                <TableData className="py-3 px-4 text-sm text-zinc-300">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableData>
                <TableData className="py-3 px-4 text-sm text-zinc-300">{dayjs().to(attendee.createdAt)}</TableData>
                <TableData className="py-3 px-4 text-sm text-zinc-300">
                  {attendee.checkedInAt ? dayjs().to(attendee.checkedInAt) : <span className="text-zinc-400">'Não fez check-in'</span> }
                </TableData>
                <TableData className="py-3 px-4 text-sm text-zinc-300">
                  <IconButton transparent={true}>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableData>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <TableRow>
            <TableData className="py-3 px-4 text-sm text-zinc-300" colSpan={3}>Mostrando {attendees.length} de {total} itens</TableData>
            <TableData className="py-3 px-4 text-sm text-zinc-300 text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>Página {page} de {totalPages}</span>
                <div className="flex gap-1.5">
                  <IconButton onClick={backToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={backPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableData>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
}

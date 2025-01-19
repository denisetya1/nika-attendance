"use client";

import { User } from '@prisma/client';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import qs from 'query-string';

const FilterForm = ({
  employees,
  month,
  year,
  userId
}: {
  employees?: Partial<User>[],
  month: string,
  year: string,
  userId?: string
}) => {
  const [selectedMonth, setSelectedMonth] = useState(month)
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedUserId, setSelectedUserId] = useState(userId)
  const [totalDays, setTotalDays] = useState(0)
  const router = useRouter()

  const endYear = Number(moment().format('YYYY'))
  const startYear = 2024

  useEffect(() => {
    const query = qs.stringify({
      month: selectedMonth,
      year: selectedYear,
      userId: selectedUserId === 'all' ? null : selectedUserId
    }, {
      skipEmptyString: true
    })

    setTotalDays(new Date(parseInt(selectedYear, 10), parseInt(selectedMonth, 10), 0).getDate())

    router.push('?' + query)
    router.refresh()
  }, [selectedMonth, selectedYear, selectedUserId])

  return (
    <div className='w-full'>
      <div className='w-full flex justify-between items-center gap-2 mb-4'>
        <div className='w-1/2'>Nama Karyawan</div>
        <div className='w-1/2 flex gap-2 items-center'>: <Select defaultValue={userId} value={selectedUserId} onValueChange={(value) => setSelectedUserId(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih karyawan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Karyawan</SelectLabel>
              {employees?.map((emp) => <SelectItem key={emp.id} value={emp.id as string}>{emp.name}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className='flex gap-2 mb-4 items-center'>
        <div className='w-1/2'>Bulan</div>
        <div className='w-1/2 flex gap-2 items-center'>: <Select defaultValue={month} value={selectedMonth} onValueChange={(value) => setSelectedMonth(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bulan</SelectLabel>
              <SelectItem value="01">Januari</SelectItem>
              <SelectItem value="02">Februari</SelectItem>
              <SelectItem value="03">Maret</SelectItem>
              <SelectItem value="04">April</SelectItem>
              <SelectItem value="05">Mei</SelectItem>
              <SelectItem value="06">Juni</SelectItem>
              <SelectItem value="07">Juli</SelectItem>
              <SelectItem value="08">Agustus</SelectItem>
              <SelectItem value="09">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
          <Select defaultValue={year} value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tahun</SelectLabel>
                {[...new Array(endYear - startYear + 1)].map((val, idx) => <SelectItem key={idx} value={String(startYear + idx)}>{startYear + idx}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='flex gap-2 mb-4 items-center'>
        <div className='w-1/2'>Jumlah Hari Kerja</div>
        <div className='w-1/2'>: {totalDays} hari</div>
      </div>
    </div>
  )
}

export default FilterForm
// src/utils/importHelper.js
import { NAMA_BULAN } from './constants'; // Pastikan path ini sesuai dengan letak constants.js Anda

export const handleImportCSV = (parsedData, existingJemaatData = []) => {
  const validDataToImport = [];
  const errors = [];

  const getMonthNumber = (monthName) => {
    if (!monthName) return '01';
    const index = NAMA_BULAN.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    return index !== -1 ? String(index + 1).padStart(2, '0') : '01';
  };

  parsedData.forEach((row, index) => {
    if (!row['Nama Lengkap'] || row['Nama Lengkap'].trim() === '') return; 

    const tgl = String(row['Tanggal lahir'] || '1').padStart(2, '0');
    const bln = getMonthNumber(row['Bulan Lahir']);
    const thn = row['Tahun lahir'] || '1900';
    const formattedTanggalLahir = `${thn}-${bln}-${tgl}`;

    let jenisNikah = row['Status nikah'] || '';
    if (row['Status nikah/Nikah Gereja/Masehi'] === 'Ya' || row['Status nikah/Nikah Gereja/Masehi'] === 'V') jenisNikah = 'Nikah Gereja/Masehi';
    else if (row['Status nikah/Nikah Adat'] === 'Ya' || row['Status nikah/Nikah Adat'] === 'V') jenisNikah = 'Nikah Adat';
    else if (row['Status nikah/Nikah Catatan Sipil/BS'] === 'Ya' || row['Status nikah/Nikah Catatan Sipil/BS'] === 'V') jenisNikah = 'Nikah Catatan Sipil/BS';

    const mappedRow = {
      noRayon: row['Rayon']?.toString().trim() || '',
      alamat: row['Alamat']?.trim() || '',
      noTelp: row['No.Telp']?.toString().trim() || '',
      kepalaKeluarga: row['Nama Kepala Keluarga']?.trim() || '',
      namaLengkap: row['Nama Lengkap']?.trim() || '',
      nik: row['NIK']?.toString().trim() || '',
      jk: row['Jenis Kelamin']?.trim() === 'L' ? 'Laki-laki' : (row['Jenis Kelamin']?.trim() === 'P' ? 'Perempuan' : row['Jenis Kelamin']),
      tempatLahir: row['Tempat Lahir']?.trim() || '',
      tanggalLahir: formattedTanggalLahir,
      goldar: row['Golongan Darah']?.trim() || 'Tidak Tahu',
      statusKeluarga: row['Status dalam Keluarga']?.trim() || '',
      baptis: row['Baptis']?.trim() || '',
      sidi: row['Sidi']?.trim() || '',
      nikah: row['Nikah']?.trim() || '',
      jenisNikah: jenisNikah,
      sukuAyah: row['Suku Ayah']?.trim() || '',
      sukuIbu: row['Suku Ibu']?.trim() || '',
      pendidikan: row['Pendidikan']?.trim() || '',
      pekerjaan: row['Pekerjaan utama']?.trim() || '',
      penghasilan: row['Penghasilan']?.trim() || '',
      asuransi: row['Apakah mempunyai jaminan/asuransi kesehatan?']?.trim() || '',
      jaminan: row['Jaminan Kesehatan'] || row['Jika asuransi lainnya, sebutkan!'] || '',
      jandaDuda: row['Janda / Duda']?.trim() || '',
      yatimPiatu: row['Yatim / Piatu']?.trim() || '',
      disabilitas: row['Disabilitas']?.trim() || '',
      jenisDisabilitas: row['Jika ya, sebutkan ragam disabilitas']?.trim() || '',
      createdAt: new Date().toISOString()
    };

    // Validasi data ganda diabaikan untuk tanggal lahir, murni fokus pada ID/NIK dan Nama
    const isDuplicate = existingJemaatData.some((existing) => 
      existing.nik === mappedRow.nik && 
      existing.namaLengkap?.toLowerCase() === mappedRow.namaLengkap?.toLowerCase()
    );

    if (isDuplicate) {
      errors.push(`Baris ${index + 1}: ${mappedRow.namaLengkap} (NIK: ${mappedRow.nik}) sudah ada.`);
    } else {
      validDataToImport.push(mappedRow);
    }
  });

  return { validDataToImport, errors };
};
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    // Menampilkan semua data kontak beserta relasi nomor teleponnya
    public function index()
    {
        // Menggunakan 'phones' sesuai relasi hasMany pada model Contact
        $contacts = Contact::with('phones')->get();

        return response()->json([
            'status' => 'success',
            'data' => $contacts
        ], 200);
    }

    // Menyimpan kontak baru beserta nomor telepon (nested array phones)
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'phones' => 'nullable|array',
            'phones.*.jenis' => 'required|string',
            'phones.*.nomor_telepon' => 'required|string',
        ]);

        // Simpan data utama kontak
        $contact = Contact::create([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
        ]);

        // Jika ada data nomor telepon yang dikirim, simpan melalui relasi phones
        if ($request->has('phones')) {
            foreach ($request->phones as $phone) {
                $contact->phones()->create([
                    'jenis' => $phone['jenis'],
                    'nomor_telepon' => $phone['nomor_telepon'],
                ]);
            }
        }

        // Load kembali relasi phones agar tampil pada response
        $contact->load('phones');

        return response()->json([
            'status' => 'success',
            'message' => 'Kontak berhasil ditambahkan',
            'data' => $contact
        ], 201);
    }

    // Menampilkan detail satu kontak spesifik
    public function show($id)
    {
        $contact = Contact::with('phones')->find($id);

        if (! $contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $contact
        ], 200);
    }

    // Mengupdate data kontak (dan mengganti/menambah phones jika diperlukan)
    public function update(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date',
        ]);

        $contact->update([
            'nama' => $request->nama,
            'alamat' => $request->alamat,
            'tanggal_lahir' => $request->tanggal_lahir,
        ]);

        $contact->load('phones');

        return response()->json([
            'status' => 'success',
            'message' => 'Kontak berhasil diupdate',
            'data' => $contact
        ], 200);
    }

    // Menghapus kontak (nomor telepon akan ikut terhapus otomatis jika menggunakan cascade onDelete di migration)
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kontak berhasil dihapus'
        ], 200);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactPhones;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat User Admin Utama (email: admin@example.com / pass: password123)
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password123'),
            ]
        );

        // 2. Jalankan User::factory() untuk membuat 9 user tambahan secara otomatis
        $randomUsers = User::factory()->count(9)->create();

        // Kumpulkan seluruh user (total 10 user)
        $allUsers = collect([$admin])->concat($randomUsers);

        // 3. Pastikan SETIAP user memiliki 3 - 5 kontak dummy, dan setiap kontak memiliki 1 - 3 nomor telepon
        $allUsers->each(function ($user) {
            Contact::factory()
                ->count(rand(3, 5))
                ->create(['user_id' => $user->id])
                ->each(function ($contact) {
                    ContactPhones::factory()
                        ->count(rand(1, 3))
                        ->create(['contact_id' => $contact->id]);
                });
        });
    }
}

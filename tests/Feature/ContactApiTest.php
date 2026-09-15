<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\ContactPhones;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        // Buat user untuk keperluan otentikasi Sanctum
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_contacts_api(): void
    {
        $response = $this->getJson('/api/kontak');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_all_contacts(): void
    {
        $contact = Contact::factory()->create();
        ContactPhones::factory()->count(2)->create(['contact_id' => $contact->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/kontak');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'id',
                        'nama',
                        'alamat',
                        'tanggal_lahir',
                        'created_at',
                        'updated_at',
                        'phones' => [
                            '*' => [
                                'id',
                                'contact_id',
                                'jenis',
                                'nomor_telepon',
                            ],
                        ],
                    ],
                ],
            ])
            ->assertJson(['status' => 'success']);
    }

    public function test_can_create_contact_with_phones(): void
    {
        $payload = [
            'nama' => 'Ahmad Dahlan',
            'alamat' => 'Jl. Merdeka No. 45, Jakarta',
            'tanggal_lahir' => '1995-08-17',
            'phones' => [
                [
                    'jenis' => 'Handphone',
                    'nomor_telepon' => '081234567890',
                ],
                [
                    'jenis' => 'Rumah',
                    'nomor_telepon' => '0215551234',
                ],
            ],
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/kontak', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'nama',
                    'alamat',
                    'tanggal_lahir',
                    'phones',
                ],
            ])
            ->assertJson([
                'status' => 'success',
                'message' => 'Kontak berhasil ditambahkan',
                'data' => [
                    'nama' => 'Ahmad Dahlan',
                    'alamat' => 'Jl. Merdeka No. 45, Jakarta',
                    'tanggal_lahir' => '1995-08-17',
                ],
            ]);

        $this->assertDatabaseHas('contact', [
            'nama' => 'Ahmad Dahlan',
        ]);

        $this->assertDatabaseHas('contact_phones', [
            'jenis' => 'Handphone',
            'nomor_telepon' => '081234567890',
        ]);
    }

    public function test_create_contact_fails_validation(): void
    {
        $payload = [
            'nama' => '', // Required
            'alamat' => '',
            'tanggal_lahir' => 'invalid-date',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/kontak', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama', 'alamat', 'tanggal_lahir']);
    }

    public function test_can_show_contact_detail(): void
    {
        $contact = Contact::factory()->create();
        ContactPhones::factory()->create([
            'contact_id' => $contact->id,
            'jenis' => 'Kantor',
            'nomor_telepon' => '0219998888',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/kontak/{$contact->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $contact->id,
                    'nama' => $contact->nama,
                    'phones' => [
                        [
                            'jenis' => 'Kantor',
                            'nomor_telepon' => '0219998888',
                        ],
                    ],
                ],
            ]);
    }

    public function test_show_non_existent_contact_returns_404(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/kontak/99999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan',
            ]);
    }

    public function test_can_update_contact(): void
    {
        $contact = Contact::factory()->create([
            'nama' => 'Nama Lama',
            'alamat' => 'Alamat Lama',
            'tanggal_lahir' => '1990-01-01',
        ]);

        $payload = [
            'nama' => 'Nama Baru',
            'alamat' => 'Alamat Baru No. 10',
            'tanggal_lahir' => '1992-05-15',
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/kontak/{$contact->id}", $payload);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Kontak berhasil diupdate',
                'data' => [
                    'id' => $contact->id,
                    'nama' => 'Nama Baru',
                    'alamat' => 'Alamat Baru No. 10',
                    'tanggal_lahir' => '1992-05-15',
                ],
            ]);

        $this->assertDatabaseHas('contact', [
            'id' => $contact->id,
            'nama' => 'Nama Baru',
        ]);
    }

    public function test_update_non_existent_contact_returns_404(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson('/api/kontak/99999', [
                'nama' => 'Test',
                'alamat' => 'Test',
                'tanggal_lahir' => '2000-01-01',
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan',
            ]);
    }

    public function test_can_delete_contact(): void
    {
        $contact = Contact::factory()->create();
        $phone = ContactPhones::factory()->create(['contact_id' => $contact->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/kontak/{$contact->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Kontak berhasil dihapus',
            ]);

        $this->assertDatabaseMissing('contact', [
            'id' => $contact->id,
        ]);

        // Phone record should also be deleted due to cascade on delete
        $this->assertDatabaseMissing('contact_phones', [
            'id' => $phone->id,
        ]);
    }

    public function test_delete_non_existent_contact_returns_404(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson('/api/kontak/99999');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan',
            ]);
    }
}

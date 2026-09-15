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
        $this->user = User::factory()->create();
    }

    public function test_unauthenticated_user_cannot_access_contacts_api(): void
    {
        $response = $this->getJson('/api/kontak');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_only_their_own_contacts(): void
    {
        // Contact owned by $this->user
        $myContact = Contact::factory()->create(['user_id' => $this->user->id]);
        ContactPhones::factory()->count(2)->create(['contact_id' => $myContact->id]);

        // Contact owned by another user
        $otherUser = User::factory()->create();
        $otherContact = Contact::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/kontak');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertEquals($myContact->id, $data[0]['id']);
    }

    public function test_can_create_contact_with_phones_associated_with_authenticated_user(): void
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
            ],
        ];

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/kontak', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Kontak berhasil ditambahkan',
                'data' => [
                    'user_id' => $this->user->id,
                    'nama' => 'Ahmad Dahlan',
                ],
            ]);

        $this->assertDatabaseHas('contact', [
            'user_id' => $this->user->id,
            'nama' => 'Ahmad Dahlan',
        ]);
    }

    public function test_can_show_own_contact_detail(): void
    {
        $contact = Contact::factory()->create(['user_id' => $this->user->id]);
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
                    'user_id' => $this->user->id,
                    'nama' => $contact->nama,
                ],
            ]);
    }

    public function test_user_cannot_access_other_users_contact_detail(): void
    {
        $otherUser = User::factory()->create();
        $otherContact = Contact::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/kontak/{$otherContact->id}");

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'Kontak tidak ditemukan',
            ]);
    }

    public function test_can_update_own_contact(): void
    {
        $contact = Contact::factory()->create([
            'user_id' => $this->user->id,
            'nama' => 'Nama Lama',
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
                'data' => [
                    'id' => $contact->id,
                    'nama' => 'Nama Baru',
                ],
            ]);
    }

    public function test_user_cannot_update_other_users_contact(): void
    {
        $otherUser = User::factory()->create();
        $otherContact = Contact::factory()->create(['user_id' => $otherUser->id, 'nama' => 'Original Name']);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/kontak/{$otherContact->id}", [
                'nama' => 'Hacked Name',
                'alamat' => 'Test',
                'tanggal_lahir' => '2000-01-01',
            ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('contact', [
            'id' => $otherContact->id,
            'nama' => 'Original Name',
        ]);
    }

    public function test_can_delete_own_contact(): void
    {
        $contact = Contact::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/kontak/{$contact->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('contact', [
            'id' => $contact->id,
        ]);
    }

    public function test_user_cannot_delete_other_users_contact(): void
    {
        $otherUser = User::factory()->create();
        $otherContact = Contact::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/kontak/{$otherContact->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('contact', [
            'id' => $otherContact->id,
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\ContactPhones;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactPhones>
 */
class ContactPhonesFactory extends Factory
{
    protected $model = ContactPhones::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contact_id' => Contact::factory(),
            'jenis' => fake()->randomElement(['Handphone', 'Rumah', 'Kantor', 'Pribadi']),
            'nomor_telepon' => fake('id_ID')->phoneNumber(),
        ];
    }
}

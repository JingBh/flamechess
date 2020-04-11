<?php

namespace App\Console\Commands;

use App\Services\EschoolSpider;
use Illuminate\Console\Command;

class UpdateEschool extends Command
{
    const groups = [
        // "1" => "teachers",
        "4" => "students",
    ];

    protected $signature = "eschool:update {cookies?}";

    protected $description = 'Get info from eschool.';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $cookies = $this->argument("cookies") ??
            $this->ask("Your cookies");

        foreach (self::groups as $groupId => $groupName) {
            $this->info("Fetching group {$groupId}...\n");

            $data = EschoolSpider::fetchOneGroup($groupId, $cookies);
            if ($data) {
                $progress = $this->output->createProgressBar(count($data));
                $progress->start();
                foreach ($data as $user) {
                    EschoolSpider::parseOneUser($groupId, $user);
                    $progress->advance();
                }
                $progress->finish();
            } else $this->error("Fetch group {$groupId} failed.");
        }
    }
}

provider "google-beta" {
  project = "handshake-456703"
  region = "us-central1"
  zone = "us-central1-c"
}

resource "google_compute_instance_from_machine_image" "instance" {
  provider = google-beta
  name     = "terraform-instance"
  zone     = "us-central1-a"

  source_machine_image = "projects/handshake-456703/global/machineImages/restaurant-app-with-reverse-proxy" 
}

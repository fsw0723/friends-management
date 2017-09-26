# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"
SHARED_WWW_FOLDER = "public/"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.ssh.forward_agent = true
  config.vm.network "private_network", ip: "10.3.3.3"

  # Forward ports for MongoDB and Express app
  config.vm.network "forwarded_port", guest: 27017, host: 27017, auto_correct: true
  config.vm.network "forwarded_port", guest: 3000, host: 3000, auto_correct: true

  config.vm.provision "shell", inline: <<-SHELL
    sudo apt-get update -y
    sudo apt-get install curl -y
    curl -L https://www.opscode.com/chef/install.sh | sudo bash
  SHELL

  config.vm.provision :chef_solo do |chef|
	# Paths to your cookbooks (on the host)
	chef.cookbooks_path = ["cookbooks"]
	# Add chef recipes
	chef.add_recipe 'nodejs'
	chef.add_recipe 'sc-mongodb'
	chef.add_recipe 'git'
  end

  # additional shared folder
  config.vm.synced_folder SHARED_WWW_FOLDER, "/var/www/friends-management"
end

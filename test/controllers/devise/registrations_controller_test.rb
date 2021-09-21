require "test_helper"

class Devise::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "should get update" do
    get devise_registrations_update_url
    assert_response :success
  end
end

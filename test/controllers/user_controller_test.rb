require "test_helper"

class UserControllerTest < ActionDispatch::IntegrationTest
  test "should get update" do
    get user_update_url
    assert_response :success
  end
end

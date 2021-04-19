require "test_helper"

class LettersControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get letters_create_url
    assert_response :success
  end
end

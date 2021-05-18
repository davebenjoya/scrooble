require "test_helper"

class WordsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get words_create_url
    assert_response :success
  end
end

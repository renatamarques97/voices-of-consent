require 'rails_helper'

RSpec.describe "InventoryAdjustments", type: :request do

  let(:user) { create(:user) }

  before do
    login_as(user, :scope => :user)
  end

  after do
    Warden.test_reset!
  end

  describe "GET /inventory_adjustments" do
    it "works! (now write some real specs)" do
      get inventory_adjustments_path
      expect(response).to have_http_status(200)
    end
  end
end

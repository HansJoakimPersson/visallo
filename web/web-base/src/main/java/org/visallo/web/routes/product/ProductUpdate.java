package org.visallo.web.routes.product;

import com.google.inject.Inject;
import com.v5analytics.webster.ParameterizedHandler;
import com.v5analytics.webster.annotations.Handle;
import com.v5analytics.webster.annotations.Optional;
import org.json.JSONObject;
import org.vertexium.Authorizations;
import org.visallo.core.model.workspace.WorkspaceRepository;
import org.visallo.core.model.workspace.product.Product;
import org.visallo.core.user.User;
import org.visallo.core.util.ClientApiConverter;
import org.visallo.web.clientapi.model.ClientApiProduct;
import org.visallo.web.parameterProviders.ActiveWorkspaceId;

import javax.servlet.http.HttpServletRequest;
import java.util.ResourceBundle;

public class ProductUpdate implements ParameterizedHandler {
    private final WorkspaceRepository workspaceRepository;

    @Inject
    public ProductUpdate(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Handle
    public ClientApiProduct handle(
            @Optional(name = "productId") String productId,
            @Optional(name = "title") String title,
            @Optional(name = "kind") String kind,
            @Optional(name = "params") String paramsStr,
            @Optional(name = "preview") String previewDataUrl,
            @ActiveWorkspaceId String workspaceId,
            Authorizations authorizations,
            ResourceBundle resourceBundle,
            HttpServletRequest request,
            User user
    ) throws Exception {
        JSONObject params = null;
        if (paramsStr != null) {
            params = new JSONObject(paramsStr);
        }

        Product product = workspaceRepository.addOrUpdateProduct(workspaceId, productId, title, kind, previewDataUrl, params, user);
        return ClientApiConverter.toClientApiProduct(product);
    }

}

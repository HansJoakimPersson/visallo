package org.visallo.web.product.map;

import com.google.inject.Inject;
import org.json.JSONObject;
import org.vertexium.Edge;
import org.vertexium.ElementBuilder;
import org.vertexium.Visibility;
import org.visallo.core.model.ontology.OntologyRepository;
import org.visallo.core.model.workspace.product.WorkProductElements;
import org.visallo.core.util.VisalloLogger;
import org.visallo.core.util.VisalloLoggerFactory;

public class MapWorkProduct extends WorkProductElements {
    @Inject
    public MapWorkProduct(OntologyRepository ontologyRepository) {
        super(ontologyRepository);
    }

    @Override
    protected void updateProductEdge(JSONObject update, ElementBuilder edgeBuilder, Visibility visibility) {
    }

    protected void setEdgeJson(Edge propertyVertexEdge, JSONObject vertex) {
    }

}
